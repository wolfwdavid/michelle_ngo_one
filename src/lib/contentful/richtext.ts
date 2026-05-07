import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';

const renderOptions = {
	renderNode: {
		[BLOCKS.EMBEDDED_ASSET]: (node: any) => {
			const { file, title } = node.data.target.fields;
			const url = file?.url;
			if (!url) return '';
			return `<img src="https:${url}?w=960&fm=webp&q=80" alt="${title || ''}" loading="lazy" class="rounded-sm" />`;
		},
		[BLOCKS.EMBEDDED_ENTRY]: () => {
			console.warn('Embedded entry in Rich Text not supported in v1');
			return '';
		},
	},
};

export function renderRichText(document: Document | null | undefined): string {
	if (!document) return '';
	return documentToHtmlString(document, renderOptions);
}
