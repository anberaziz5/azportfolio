import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'table',
  title: 'Legacy Table (Do Not Use)',
  type: 'object',
  readOnly: true, // Prevent creating new ones
  fields: [
    defineField({
      name: 'rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tableRow',
          fields: [
            defineField({
              name: 'cells',
              type: 'array',
              of: [{ type: 'string' }]
            })
          ]
        })
      ]
    })
  ],
  preview: {
    select: {
      rows: 'rows'
    },
    prepare(selection) {
      const count = selection.rows?.length || 0
      return { title: `Legacy Table (\${count} rows) - Please replace with Rich Text Table` }
    }
  }
})
