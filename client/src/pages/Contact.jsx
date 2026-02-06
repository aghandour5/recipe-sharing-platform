import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Instagram, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
    return (
        <div className="page-container">
            <Navbar />

            <section className="py-20 bg-muted/30">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h1 className="font-heading text-4xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-muted-foreground text-lg">
                            Have a question or feedback? We'd love to hear from you. Reach out to us directly or fill out the form below.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <Card>
                                <CardContent className="p-6 flex items-start space-x-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Phone</h3>
                                        <p className="text-muted-foreground">+961 79 307 907</p>
                                        <p className="text-sm text-muted-foreground mt-1">Mon-Fri from 8am to 5pm</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 flex items-start space-x-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Email</h3>
                                        <p className="text-muted-foreground">aghandour090@gmail.com</p>
                                        <p className="text-sm text-muted-foreground mt-1">We'll get back to you within 24h</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 flex items-start space-x-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <Instagram className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Instagram</h3>
                                        <p className="text-muted-foreground">@3ali.ghandour</p>
                                        <p className="text-sm text-muted-foreground mt-1">Follow for updates & behind the scenes</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <Card>
                            <CardContent className="p-8">
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First name</label>
                                            <Input placeholder="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last name</label>
                                            <Input placeholder="Doe" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input type="email" placeholder="john@example.com" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Message</label>
                                        <Textarea placeholder="How can we help you?" className="min-h-[120px]" />
                                    </div>

                                    <Button className="w-full">
                                        <Send className="mr-2 h-4 w-4" /> Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
