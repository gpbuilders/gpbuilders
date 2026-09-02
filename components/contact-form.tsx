'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  // "Discuss Similar Project" in the project modal links here with the project
  // it came from, so the enquiry starts with context rather than a blank box.
  // Read once as the initial state — the visitor stays in control of it after.
  const searchParams = useSearchParams()
  const fromProject = searchParams.get('project')
  const fromType = searchParams.get('type')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: fromType ?? '',
    message: fromProject
      ? `I'd like to discuss a project similar to "${fromProject}".\n\n`
      : '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: '',
      })
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-foreground">
            Thank You!
          </h3>
          <p className="mt-2 text-muted-foreground">
            We&apos;ve received your enquiry and will get back to you shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-foreground mb-2"
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
            className="form-input"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label
            htmlFor="projectType"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">Select a project type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="interiors">Interiors Only</option>
            <option value="landscape">Landscape</option>
            <option value="consultation">Consultation</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-foreground mb-2"
        >
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="form-input resize-none"
          placeholder="Describe your project, vision, and any specific requirements..."
        />
      </div>

      <Button type="submit" className="h-12 w-full text-base">
        Send Enquiry
      </Button>
    </form>
  )
}
