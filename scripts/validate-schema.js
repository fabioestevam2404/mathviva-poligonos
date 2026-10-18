/*
 * Validador mínimo de JSON Schema, sem dependências (princípio P7).
 * Implementa só as palavras-chave usadas pelos contratos em schemas/:
 *   type (inclusive listas e "integer"), const, enum, minimum, maximum, minLength, maxLength,
 *   pattern, items, minItems, maxItems, uniqueItems, required, properties, patternProperties,
 *   additionalProperties (false ou schema), $ref para "#/$defs/…".
 * Uma palavra-chave desconhecida gera erro, para que o contrato nunca pareça mais estrito do que é.
 *
 *   const { validate } = require('./validate-schema');
 *   const erros = validate(schema, dados); // [] quando válido
 */
'use strict';

const KNOWN = new Set(['$schema', '$id', '$defs', '$ref', '$comment', 'title', 'description', 'type', 'const', 'enum',
  'minimum', 'maximum', 'minLength', 'maxLength', 'pattern', 'items', 'minItems', 'maxItems', 'uniqueItems',
  'required', 'properties', 'patternProperties', 'additionalProperties']);

function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v;
}

function resolve(root, ref) {
  const m = /^#\/\$defs\/([A-Za-z0-9_-]+)$/.exec(ref);
  if (!m || !root.$defs || !root.$defs[m[1]]) throw new Error(`$ref não suportada ou inexistente: ${ref}`);
  return root.$defs[m[1]];
}

function check(root, schema, data, path, errors) {
  for (const k of Object.keys(schema)) if (!KNOWN.has(k)) throw new Error(`palavra-chave não suportada em ${path}: ${k}`);
  if (schema.$ref) return check(root, resolve(root, schema.$ref), data, path, errors);

  const t = typeOf(data);
  if (schema.type) {
    const types = [].concat(schema.type);
    if (!types.some(ty => ty === t || (ty === 'number' && t === 'integer'))) {
      errors.push(`${path}: esperado ${types.join(' ou ')}, encontrado ${t}`);
      return errors;
    }
  }
  if ('const' in schema && data !== schema.const) errors.push(`${path}: deve ser ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(data)) errors.push(`${path}: deve ser um de ${JSON.stringify(schema.enum)}`);

  if (t === 'integer' || t === 'number') {
    if ('minimum' in schema && data < schema.minimum) errors.push(`${path}: menor que ${schema.minimum}`);
    if ('maximum' in schema && data > schema.maximum) errors.push(`${path}: maior que ${schema.maximum}`);
  }
  if (t === 'string') {
    const len = [...data].length;
    if ('minLength' in schema && len < schema.minLength) errors.push(`${path}: menor que ${schema.minLength} caracteres`);
    if ('maxLength' in schema && len > schema.maxLength) errors.push(`${path}: maior que ${schema.maxLength} caracteres`);
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(data)) errors.push(`${path}: não segue o padrão ${schema.pattern}`);
  }
  if (t === 'array') {
    if ('minItems' in schema && data.length < schema.minItems) errors.push(`${path}: menos de ${schema.minItems} itens`);
    if ('maxItems' in schema && data.length > schema.maxItems) errors.push(`${path}: mais de ${schema.maxItems} itens`);
    if (schema.uniqueItems && new Set(data.map(v => JSON.stringify(v))).size !== data.length) errors.push(`${path}: itens repetidos`);
    if (schema.items) data.forEach((v, i) => check(root, schema.items, v, `${path}[${i}]`, errors));
  }
  if (t === 'object') {
    for (const k of schema.required || []) if (!(k in data)) errors.push(`${path}: falta o campo "${k}"`);
    const props = schema.properties || {};
    const patterns = Object.entries(schema.patternProperties || {}).map(([p, s]) => [new RegExp(p, 'u'), s]);
    for (const [k, v] of Object.entries(data)) {
      const p = `${path}.${k}`;
      let matched = false;
      if (k in props) { matched = true; check(root, props[k], v, p, errors); }
      for (const [re, s] of patterns) if (re.test(k)) { matched = true; check(root, s, v, p, errors); }
      if (!matched && 'additionalProperties' in schema) {
        if (schema.additionalProperties === false) errors.push(`${path}: campo não permitido "${k}"`);
        else check(root, schema.additionalProperties, v, p, errors);
      }
    }
  }
  return errors;
}

function validate(schema, data) {
  return check(schema, schema, data, '$', []);
}

module.exports = { validate };
