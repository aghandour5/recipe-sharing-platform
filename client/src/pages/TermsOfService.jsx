import { Navbar } from "@/components/layout/Navbar";

export default function TermsOfService() {
    return (
        <div className="page-container">
            <Navbar />
            <div className="container-custom max-w-4xl py-12">
                <h1 className="font-heading text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-muted-foreground mb-6">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing our website, Sufra, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. User License</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Permission is granted to temporarily download one copy of the materials (information or software) on Sufra's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Modify or copy the materials;</li>
                            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li>Attempt to decompile or reverse engineer any software contained on Sufra's website;</li>
                            <li>Remove any copyright or other proprietary notations from the materials; or</li>
                            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The materials on Sufra's website are provided on an 'as is' basis. Sufra makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            In no event shall Sufra or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sufra's website, even if Sufra or a Sufra authorized representative has been notified orally or in writing of the possibility of such damage.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
