import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private renderer: Renderer2;
    private currentTheme: 'light' | 'dark' = 'dark';

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.loadTheme();
    }

    toggleTheme(): void {
        const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(nextTheme);
    }

    setTheme(theme: 'light' | 'dark'): void {
        this.currentTheme = theme;
        this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    get isDarkMode(): boolean {
        return this.currentTheme === 'dark';
    }

    private loadTheme(): void {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (savedTheme === 'light' || savedTheme === 'dark') {
            this.setTheme(savedTheme);
        } else {
            this.setTheme('dark');
        }
    }
}
