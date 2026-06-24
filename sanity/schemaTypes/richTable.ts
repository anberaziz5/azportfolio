import { defineField, defineType, defineArrayMember } from 'sanity'

// We need a wrapper object for rows because Sanity arrays cannot directly contain other arrays.
export default defineType({
  name: 'richTable',
  title: 'Rich Text Table',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tableRow',
          title: 'Row',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'tableCell',
                  title: 'Cell',
                  fields: [
                    defineField({
                      name: 'content',
                      title: 'Cell Content',
                      type: 'array',
                      of: [{ type: 'block' }],
                    }),
                  ],
                  preview: {
                    select: {
                      blocks: 'content'
                    },
                    prepare(selection) {
                      const block = (selection.blocks || []).find((b: any) => b._type === 'block')
                      const title = block ? block.children.filter((child: any) => child._type === 'span').map((span: any) => span.text).join('') : 'Empty cell'
                      return { title }
                    }
                  }
                }),
              ],
            }),
          ],
          preview: {
            select: {
              cells: 'cells'
            },
            prepare(selection) {
              const count = selection.cells?.length || 0
              return { title: `Row with \${count} cells` }
            }
          }
        }),
      ],
    }),
  ],
  preview: {
    select: {
      rows: 'rows'
    },
    prepare(selection) {
      const count = selection.rows?.length || 0
      return { title: `Table (\${count} rows)` }
    }
  }
})
