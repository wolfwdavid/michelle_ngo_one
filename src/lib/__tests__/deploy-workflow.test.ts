import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('deploy.yml', () => {
	const workflowContent = readFileSync(
		resolve(process.cwd(), '.github/workflows/deploy.yml'),
		'utf-8'
	);

	it('has repository_dispatch trigger with contentful-publish type', () => {
		expect(workflowContent).toContain('repository_dispatch');
		expect(workflowContent).toContain('contentful-publish');
	});

	it('has push trigger on main branch', () => {
		expect(workflowContent).toContain('push:');
		expect(workflowContent).toContain("'main'");
	});

	it('has workflow_dispatch trigger', () => {
		expect(workflowContent).toContain('workflow_dispatch');
	});

	it('passes CONTENTFUL_SPACE_ID secret to build step', () => {
		expect(workflowContent).toContain('CONTENTFUL_SPACE_ID');
		expect(workflowContent).toContain('secrets.CONTENTFUL_SPACE_ID');
	});

	it('passes CONTENTFUL_ACCESS_TOKEN secret to build step', () => {
		expect(workflowContent).toContain('CONTENTFUL_ACCESS_TOKEN');
		expect(workflowContent).toContain('secrets.CONTENTFUL_ACCESS_TOKEN');
	});
});
