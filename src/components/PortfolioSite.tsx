'use client';

import { useTheme } from './ThemeProvider';

export function PortfolioSite() {
    const { isUpdating } = useTheme();

    return (
        <div className={`min-h-screen transition-all duration-500 ${isUpdating ? 'opacity-75' : 'opacity-100'}`}>
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <nav className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-foreground">John Doe</div>
                        <ul className="flex space-x-6">
                            <li><a href="#about" className="text-foreground hover:text-primary transition-colors">About</a></li>
                            <li><a href="#projects" className="text-foreground hover:text-primary transition-colors">Projects</a></li>
                            <li><a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-background py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold text-foreground mb-6">
                        Full-Stack Developer
                    </h1>
                    <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
                        I create beautiful, functional, and user-centered digital experiences.
                    </p>
                    <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                        Get In Touch
                    </button>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="bg-card py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-foreground text-center mb-12">About Me</h2>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-muted text-lg leading-relaxed">
                                I&apos;m a passionate developer with 5+ years of experience building web applications.
                                I specialize in React, Node.js, and modern web technologies.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background p-4 rounded-lg border border-border">
                                <div className="text-2xl font-bold text-primary">50+</div>
                                <div className="text-sm text-muted">Projects Completed</div>
                            </div>
                            <div className="bg-background p-4 rounded-lg border border-border">
                                <div className="text-2xl font-bold text-success">5+</div>
                                <div className="text-sm text-muted">Years Experience</div>
                            </div>
                            <div className="bg-background p-4 rounded-lg border border-border">
                                <div className="text-2xl font-bold text-accent">100%</div>
                                <div className="text-sm text-muted">Client Satisfaction</div>
                            </div>
                            <div className="bg-background p-4 rounded-lg border border-border">
                                <div className="text-2xl font-bold text-warning">24/7</div>
                                <div className="text-sm text-muted">Support Available</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="bg-background py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-foreground text-center mb-12">Featured Projects</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "E-Commerce Platform",
                                description: "A modern e-commerce solution with React and Node.js",
                                tech: ["React", "Node.js", "MongoDB"],
                                color: "primary"
                            },
                            {
                                title: "Task Management App",
                                description: "Collaborative task management with real-time updates",
                                tech: ["Vue.js", "Socket.io", "PostgreSQL"],
                                color: "success"
                            },
                            {
                                title: "Portfolio Website",
                                description: "Dynamic portfolio with theme customization",
                                tech: ["Next.js", "Tailwind CSS", "TypeScript"],
                                color: "accent"
                            }
                        ].map((project, index) => (
                            <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-semibold text-foreground mb-3">{project.title}</h3>
                                <p className="text-muted mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map((tech, techIndex) => (
                                        <span
                                            key={techIndex}
                                            className={`text-xs px-2 py-1 rounded bg-${project.color}/10 text-${project.color} border border-${project.color}/20`}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                                    View Project →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-card py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-foreground text-center mb-12">Get In Touch</h2>
                    <div className="max-w-2xl mx-auto">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary"
                                />
                            </div>
                            <textarea
                                placeholder="Message"
                                rows={5}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary resize-none"
                            />
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background border-t border-border py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-muted">© 2024 John Doe. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
