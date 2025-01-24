const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 shadow-md rounded-lg">
      <p className="text-gray-200 mb-6">
        <span className="text-green-400 text-4xl">Welcome to <strong>Picker</strong></span> – a fast, secure, and developer-friendly CDN (Content Delivery Network)
        designed to simplify media storage and retrieval. Picker enables developers to store and access assets like
        images, SVGs, and icons effortlessly. Whether you need to offload image storage from your app or reduce
        database size, Picker provides a streamlined solution with quick access times and scalable storage, backed by
        reliable cloud infrastructure.
      </p>

      <h2 className="text-2xl font-semibold text-blue-500 mb-3">Why Picker?</h2>
      <p className="text-gray-200 mb-6">
        Picker was built with developers in mind. We understand the need for a CDN that’s easy to set up, efficient, and
        integrates seamlessly with modern web applications. With robust backend support and a user-friendly interface,
        Picker takes the complexity out of CDN management, allowing you to focus on building great applications.
      </p>

      <h2 className="text-2xl font-semibold text-blue-500 mb-3">Technologies Used</h2>
      <ul className="list-disc list-inside text-gray-200 space-y-2 mb-6">
        <li><strong>Backend</strong>: Node.js with Express, providing a stable and efficient server-side foundation.</li>
        <li><strong>Authentication</strong>: Managed with Clerk for secure and seamless user management.</li>
        <li><strong>Database</strong>: PostgreSQL, managed with Prisma ORM for reliable data handling.</li>
        <li><strong>Caching</strong>: Redis, to store user session data, reducing API calls and improving response times.</li>
        <li><strong>Storage</strong>: AWS S3 for file storage, ensuring durability and accessibility for media assets.</li>
        <li><strong>Deployment</strong>: Amazon EC2 with a self-signed SSL certificate for secure communications.</li>
        <li><strong>Frontend</strong>: Built with React for efficient, component-based UI development.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-blue-500 mb-3">Get in Touch</h2>
      <p className="text-gray-200 mb-3">If you have questions or need support, feel free to reach out:</p>
      <a href="mailto:avi.banerjee@example.com" className="text-green-600 hover:underline">Email</a>,
      <a href="https://github.com/piglitch" className="text-green-500 hover:underline" target="_blank" rel="noopener noreferrer"> Github</a>,
      <a href="https://linkedin.com/in/avi-banerjee" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer"> LinkedIn</a>
      <p className="text-gray-200 mt-6">Thank you for choosing Picker. We’re excited to help you streamline your asset management and make your development process even more efficient.</p>
    </div>
  );
};

export default About;
