import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface ContactNotificationProps {
    senderName: string;
    senderEmail: string;
    message: string;
}

export const ContactNotification = ({
    senderName = "John Doe",
    senderEmail = "john@example.com",
    message = "Hello, I'd like to learn more about SoterCare.",
}: ContactNotificationProps) => {
    return (
        <Html>
            <Head />
            <Preview>New message from {senderName} via SoterCare</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Brand Header */}
                    <Section style={brandSection}>
                        <Heading style={brandText}>SOTERCARE</Heading>
                        <Text style={subheading}>NEW CONTACT MESSAGE</Text>
                    </Section>

                    <Hr style={divider} />

                    {/* Alert Banner */}
                    <Section style={alertBanner}>
                        <Text style={alertText}>📬 You have a new message</Text>
                    </Section>

                    {/* Sender Details */}
                    <Section style={detailsSection}>
                        <Text style={label}>FROM</Text>
                        <Text style={value}>{senderName}</Text>

                        <Text style={label}>EMAIL</Text>
                        <Link href={`mailto:${senderEmail}`} style={emailLink}>
                            {senderEmail}
                        </Link>
                    </Section>

                    <Hr style={divider} />

                    {/* Message */}
                    <Section style={messageSection}>
                        <Text style={label}>MESSAGE</Text>
                        <Text style={messageText}>{message}</Text>
                    </Section>

                    {/* Reply Button */}
                    <Section style={buttonSection}>
                        <Link href={`mailto:${senderEmail}?subject=Re: Your message to SoterCare`} style={button}>
                            Reply to {senderName}
                        </Link>
                    </Section>

                    {/* Footer */}
                    <Section style={footerSection}>
                        <Text style={copyright}>
                            This message was sent via the SoterCare website contact form.
                        </Text>
                        <Text style={copyright}>
                            © {new Date().getFullYear()} SoterCare. Wellness Simplified.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#fafafa',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    padding: '40px 0',
};

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    margin: '0 auto',
    maxWidth: '600px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};

const brandSection = {
    textAlign: 'center' as const,
    marginBottom: '10px',
};

const brandText = {
    margin: '0',
    fontSize: '24px',
    letterSpacing: '4px',
    fontWeight: '800',
    color: '#000000',
    textTransform: 'uppercase' as const,
};

const subheading = {
    margin: '8px 0 0 0',
    fontSize: '12px',
    color: '#a0cbdb',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    fontWeight: '600',
};

const divider = {
    borderColor: '#eeeeee',
    margin: '20px 0',
};

const alertBanner = {
    backgroundColor: '#f0f9fc',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center' as const,
    marginBottom: '24px',
};

const alertText = {
    margin: '0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
};

const detailsSection = {
    marginBottom: '10px',
};

const label = {
    margin: '0 0 4px 0',
    fontSize: '11px',
    color: '#999999',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    fontWeight: '600',
};

const value = {
    margin: '0 0 16px 0',
    fontSize: '16px',
    color: '#1a1a1a',
    fontWeight: '500',
};

const emailLink = {
    fontSize: '16px',
    color: '#a0cbdb',
    textDecoration: 'none',
    fontWeight: '500',
};

const messageSection = {
    marginBottom: '30px',
};

const messageText = {
    color: '#333333',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0',
    backgroundColor: '#f9f9f9',
    padding: '16px 20px',
    borderRadius: '8px',
    borderLeft: '3px solid #a0cbdb',
};

const buttonSection = {
    textAlign: 'center' as const,
    marginBottom: '30px',
};

const button = {
    backgroundColor: '#a0cbdb',
    borderRadius: '6px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1px',
    padding: '14px 28px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
};

const footerSection = {
    textAlign: 'center' as const,
    borderTop: '1px solid #eeeeee',
    paddingTop: '24px',
};

const copyright = {
    margin: '0 0 4px 0',
    fontSize: '12px',
    color: '#aaaaaa',
};

export default ContactNotification;
