import { base } from '$app/paths';

export interface NavItem {
	label: string;
	href: string;
}

export interface SocialLink {
	label: string;
	href: string;
	icon: string;
}

export const navItems: NavItem[] = [
	{ label: 'Home', href: `${base}/` },
	{ label: 'Advertising', href: `${base}/advertising/` },
	{ label: 'Film-TV', href: `${base}/film-tv/` },
	{ label: 'UX Design', href: `${base}/ux-design/` },
	{ label: 'Social & Transmedia', href: `${base}/social-transmedia/` },
	{ label: 'Publishing', href: `${base}/publishing/` },
	{ label: 'About', href: `${base}/about/` },
];

export const socialLinks: SocialLink[] = [
	{ label: 'IMDb', href: 'https://www.imdb.com/name/PLACEHOLDER/', icon: 'imdb' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/PLACEHOLDER/', icon: 'linkedin' },
	{ label: 'Vimeo', href: 'https://vimeo.com/user2149742', icon: 'vimeo' },
	{ label: 'YouTube', href: 'https://www.youtube.com/PLACEHOLDER', icon: 'youtube' },
];
