
export function Footer() {
    return (
        <footer className="w-full py-6 bg-secondary/30 mt-auto border-t">
            <div className="container-custom flex flex-col items-center justify-center text-center gap-4 text-sm text-muted-foreground">
                <div className="flex gap-6">
                    <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
                    <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <p>&copy; {new Date().getFullYear()} CulinaryShare.</p>
                    <p>Designed & Developed by Ali Sallam Ghandour | Full Stack Web Developer</p>
                </div>
            </div>
        </footer>
    );
}
