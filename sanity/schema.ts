import { type SchemaTypeDefinition } from 'sanity'
import post from './schemaTypes/post'
import author from './schemaTypes/author'
import richTable from './schemaTypes/richTable'
import legacyTable from './schemaTypes/legacyTable'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, post, richTable, legacyTable],
}
