
import { formInput } from '@upupa/dynamic-form';
import { column, schemeRoutesFromModel } from '@upupa/cp';

const tagsAdapter = {
    dataSource: 'server',
    path: '/tag',
    selectedColumns: ['_id', 'name'],
    keyProperty: '_id',
    valueProperty: '_id',
    displayProperty: 'name'
} as any

@schemeRoutesFromModel('tag', { icon: 'tag', text: 'Taxonomies' })
export class Category {
    @formInput({ input: 'text', label: 'Slug', required: true })
    @column({ header: 'Slug' })
    _id: string = 'tax1';


    @formInput({ input: 'text', required: true })
    @column()
    name = 'Tax one';

    @formInput({ input: 'select', adapter: tagsAdapter })
    parent?: string;
}