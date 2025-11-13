import { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData)
    // Reset form after submission
    setFormData({
      fullName: '',
      email: '',
      subject: '',
      message: '',
    })
  }

  return (
    <div className="bg-slate-950">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Section - Contact Form */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-slate-100">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Enter the subject"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 resize-none"
                  placeholder="Enter your message"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Section - Contact Information & Crisis Box */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-slate-100">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xl">
                    🌎
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      Address
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Shield 360 Headquarters
                      <br />
                      India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xl">
                    📞
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      Emergency
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      24/7 Helpline Available
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xl">
                    ✉️
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      Email
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      support@shield360.org
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xl">
                    ⚖️
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      Legal Support
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      NALSA Legal Aid Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Crisis Box */}
            <div className="rounded-lg bg-red-600 p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white">In Crisis?</h3>
              <p className="mt-2 text-sm text-white/90">
                Immediate help is available 24/7.
              </p>
              <button
                type="button"
                className="mt-6 w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
              >
                Call Helpline Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

