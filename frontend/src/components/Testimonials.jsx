import React from 'react';

const TestimonialCard = ({ name, role, content, avatar }) => {
  return (
    <div className="card">
      <div className="flex items-start gap-md">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary font-bold">
          {name.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="text-secondary mb-sm">"{content}"</p>
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-sm text-tertiary">{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Verified Investor",
      content: "Goldmine Pro has transformed my financial life. The daily returns are consistent and the platform is super easy to use!"
    },
    {
      name: "Priya Sharma",
      role: "Premium Member",
      content: "Best investment platform I've used. The withdrawal process is seamless and customer support is excellent."
    },
    {
      name: "Amit Patel",
      role: "Active User",
      content: "I've been using Goldmine Pro for 6 months now and have seen steady returns. Highly recommended!"
    }
  ];

  return (
    <div className="mb-xl">
      <h2 className="font-bold text-xl mb-lg text-center">What Our Users Say</h2>
      <div className="grid grid-cols-1 gap-md">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;