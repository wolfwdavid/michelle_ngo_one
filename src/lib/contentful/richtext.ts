import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';

function isVideoUrl(url: string): boolean {
	return /vimeo\.com\/\d+|youtube\.com\/watch|youtu\.be\//.test(url);
}

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
		[INLINES.HYPERLINK]: (node: any) => {
			const url: string = node.data.uri;
			const text = node.content
				.filter((c: any) => c.nodeType === 'text')
				.map((c: any) => c.value)
				.join('');

			if (isVideoUrl(url)) {
				return `<div class="my-6 aspect-video" data-video-facade="${encodeURIComponent(url)}" data-video-title="${encodeURIComponent(text)}"></div>`;
			}

			// Regular hyperlink -- preserve external link behavior
			const isExternal = url.startsWith('http');
			const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
			return `<a href="${url}"${attrs}>${text}</a>`;
		},
	},
};

export function renderRichText(document: Document | null | undefined): string {
	if (!document) return '';
	return documentToHtmlString(document, renderOptions);
}
