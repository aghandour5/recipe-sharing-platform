import { Navbar } from "@/components/layout/Navbar";

export default function PrivacyPolicy() {
    return (
        <div className="page-container">
            <Navbar />
            <div className="container-custom max-w-4xl py-12">
                <h1 className="font-heading text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-muted-foreground mb-6">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We collect information that you provide directly to us when you register for an account, create a profile, post recipes, or communicate with us. This information may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Name and contact information (email address);</li>
                            <li>Account credentials (username and password);</li>
                            <li>Profile information (avatar, bio);</li>
                            <li>Content you generate (recipes, comments, photos).</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use the information we collect to provide, maintain, and improve our services, including to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Process your registration and manage your account;</li>
                            <li>Facilitate the sharing of recipes and community interaction;</li>
                            <li>Send you technical notices, updates, and support messages;</li>
                            <li>Respond to your comments, questions, and customer service requests.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet or email transmission is ever fully secure or error free.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
