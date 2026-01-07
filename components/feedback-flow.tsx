"use client"

import { useState, useRef } from "react"

interface FeedbackFlowProps {
  companyName: string
  googleReviewUrl: string
}

export function FeedbackFlow({ companyName, googleReviewUrl }: FeedbackFlowProps) {
  const [step, setStep] = useState<"rating" | "positive" | "negative" | "thanks">("rating")
  const [rating, setRating] = useState<number>(0)
  const [showAiInputs, setShowAiInputs] = useState(false)
  const [showReviewWrap, setShowReviewWrap] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [genMessage, setGenMessage] = useState("")
  const [genStatus, setGenStatus] = useState<"neutral" | "ok" | "err">("neutral")
  const [generatedReview, setGeneratedReview] = useState("")

  // Form states
  const [service, setService] = useState("Public Adjusting for Residential")
  const [timeframe, setTimeframe] = useState("")
  const reviewBoxRef = useRef<HTMLTextAreaElement>(null)

  const handleRate = (score: number) => {
    setRating(score)
    if (score >= 4) {
      setStep("positive")
    } else {
      setStep("negative")
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenMessage("Creating a simple draft based on your details…")
    setGenStatus("neutral")

    try {
      const res = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: companyName,
          service: service,
          timeframe: timeframe,
          price: "great value",
          hints: "",
          tone: "friendly",
          length: "normal",
          language: "en",
        }),
      })

      const data = await res.json()

      if (data.success && data.text) {
        setGeneratedReview(data.text)
        setShowAiInputs(false)
        setShowReviewWrap(true)
        setGenMessage("Draft generated. Feel free to tweak it before publishing.")
        setGenStatus("ok")
      } else {
        setGenMessage(data.message || "Couldn't generate a draft. Please try again.")
        setGenStatus("err")
      }
    } catch (e) {
      setGenMessage("Network error. Please try again.")
      setGenStatus("err")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedReview) {
      setGenMessage("Please write (or generate) your review first.")
      setGenStatus("err")
      return
    }

    try {
      await navigator.clipboard.writeText(generatedReview)
      setGenMessage("Copied to clipboard. Paste it on the Google page.")
      setGenStatus("ok")
    } catch (e) {
      setGenMessage("Couldn't copy automatically. Please copy manually.")
      setGenStatus("err")
    }
  }

  const handlePublish = () => {
    window.open(googleReviewUrl, "_blank")
  }

  const handleDirectPost = () => {
    window.open(googleReviewUrl, "_blank")
  }

  return (
    <div className="custom-wrap">
      <header className="flex flex-col items-center gap-4 py-6 mb-8 text-center">
        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-[#e0e7ef] flex items-center justify-center">
          <img
            src="https://imagedelivery.net/_YTjg6tu3dV3JnyQiIl6NQ/b3bc47be-de73-4925-ad42-10a1adb82200/public"
            alt="Business Logo"
            className="max-w-full max-h-full object-contain p-2"
          />
        </div>
        <div>
          <h1 className="text-[32px] m-0 font-bold text-[#0d5ba6] tracking-tight">Blu' Steakhouse</h1>
          <p className="text-[#6b7280] text-base m-0 mt-2">Your feedback matters to us</p>
        </div>
      </header>

      {step === "rating" && (
        <section className="custom-card animate__animated animate__fadeIn">
          <h2 className="text-[32px] m-0 mb-3 font-bold text-[#1a1a1a] leading-tight">
            How was your experience with <span className="text-[#0d5ba6]">Blu' Steakhouse</span>?
          </h2>
          <p className="text-[#6b7280] text-lg m-0 mb-6 leading-relaxed">
            Choose the option that best matches your visit. This takes ~30 seconds.
          </p>
          <div className="flex gap-4 flex-wrap">
            {[
              { score: 1, emoji: "😞", label: "Very poor" },
              { score: 2, emoji: "☹️", label: "Poor" },
              { score: 3, emoji: "😐", label: "Okay" },
              { score: 4, emoji: "🙂", label: "Good" },
              { score: 5, emoji: "🤩", label: "Excellent" },
            ].map((item) => (
              <button key={item.score} type="button" className="rate-btn" onClick={() => handleRate(item.score)}>
                <div className="text-[36px]">{item.emoji}</div>
                <div className="text-[14px] font-medium text-[#6b7280]">{item.label}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === "positive" && (
        <section className="custom-card animate__animated animate__fadeIn">
          <h2 className="text-[32px] m-0 mb-3 font-bold text-[#1a1a1a] leading-tight">
            Awesome - Thank You! 🌟🌟🌟🌟🌟
          </h2>

          {!showReviewWrap && (
            <p className="text-[#6b7280] text-lg m-0 mb-6 leading-relaxed">
              Would you mind posting a quick public review? It really helps small businesses like ours.
              <br />
              If you need help writing a review, you can use our AI tool to help you.
            </p>
          )}

          {!showAiInputs && !showReviewWrap && (
            <div className="flex gap-4 flex-wrap mt-4">
              <button className="custom-btn primary" onClick={handleDirectPost}>
                Post Review on Google
              </button>
              <button className="custom-btn" onClick={() => setShowAiInputs(true)}>
                Generate AI Review
              </button>
            </div>
          )}

          {showAiInputs && (
            <div className="animate__animated animate__fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div>
                  <label className="block text-sm font-medium text-[#6b7280] mb-2">Service you received</label>
                  <input
                    className="custom-input white"
                    placeholder="e.g., lock rekey, AC repair, deep cleaning"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6b7280] mb-2">Positive Points</label>
                  <input
                    className="custom-input white"
                    placeholder="e.g., Price, Professionalism, Response Time"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4 flex-wrap mt-5">
                <button className="custom-btn primary" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? "Generating…" : "Generate Review"}
                </button>
              </div>
              {genMessage && (
                <div
                  className={`mt-3 text-base font-medium ${genStatus === "ok" ? "text-[#10b981]" : genStatus === "err" ? "text-[#dc2626]" : "text-[#6b7280]"}`}
                >
                  {genMessage}
                </div>
              )}
            </div>
          )}

          {showReviewWrap && (
            <div className="mt-5 animate__animated animate__fadeIn">
              <div className="w-full">
                <label className="block text-sm font-medium text-[#6b7280] mb-2">Your review</label>
                <textarea
                  ref={reviewBoxRef}
                  className="w-full min-h-[180px] p-4 rounded-xl border-2 border-[#d1d9e6] bg-white text-[#1a1a1a] resize-y text-base leading-relaxed focus:outline-none focus:border-[#0d5ba6] transition-colors"
                  value={generatedReview}
                  onChange={(e) => setGeneratedReview(e.target.value)}
                  placeholder="Your generated review will appear here…"
                />
              </div>

              <p className="text-base text-[#6b7280] mt-3 leading-relaxed">
                Tip: Click <strong className="text-[#1a1a1a]">Copy Review Text</strong>, then on the Google page just{" "}
                <strong className="text-[#1a1a1a]">paste</strong> and submit.
              </p>

              <div className="flex gap-4 flex-wrap mt-4">
                <button className="custom-btn" onClick={handleCopy}>
                  Copy Review Text
                </button>
                <button className="custom-btn primary" onClick={handlePublish}>
                  Publish On Google
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-[#e0e7ef]">
            <button
              className="custom-btn"
              onClick={() => {
                setStep("rating")
                setShowAiInputs(false)
                setShowReviewWrap(false)
                setGeneratedReview("")
                setGenMessage("")
              }}
            >
              Go back
            </button>
          </div>
        </section>
      )}

      {step === "negative" && (
        <section className="custom-card animate__animated animate__fadeIn">
          <h2 className="text-[32px] m-0 mb-3 font-bold text-[#1a1a1a] leading-tight">We are listening</h2>
          <p className="text-[#6b7280] text-lg m-0 mb-6 leading-relaxed">
            We're sorry it wasn't perfect. Please tell us what happened and we'll make it right.
          </p>

          <form
            action="https://formspree.io/f/mvgldjyz"
            method="POST"
            encType="multipart/form-data"
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            onSubmit={() => {
              // Let form submit naturally, then show thanks after a brief delay
              setTimeout(() => setStep("thanks"), 1000)
            }}
          >
            <div>
              <label className="block text-sm font-medium text-[#6b7280] mb-2">Full name</label>
              <input name="name" className="custom-input" placeholder="Jane Doe" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6b7280] mb-2">Email</label>
              <input type="email" name="email" className="custom-input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6b7280] mb-2">Phone</label>
              <input name="phone" className="custom-input" placeholder="(555) 555-5555" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6b7280] mb-2">Service date</label>
              <input type="date" name="service_date" className="custom-input" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-[#6b7280] mb-2">What can we improve?</label>
              <textarea
                name="feedback"
                className="custom-input min-h-[120px]"
                placeholder="Tell us what happened..."
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-[#6b7280] mb-2">Attach a file (optional)</label>
              <input type="file" name="upload" className="custom-input" />
            </div>
            <input type="hidden" name="rating" value={rating} />
            <div className="col-span-1 md:col-span-2 flex gap-4 flex-wrap">
              <button className="custom-btn bad" type="submit">
                Send Feedback
              </button>
              <button className="custom-btn" type="button" onClick={() => setStep("rating")}>
                Go back
              </button>
            </div>
          </form>
        </section>
      )}

      {step === "thanks" && (
        <section className="custom-card animate__animated animate__fadeIn">
          <h2 className="text-[32px] m-0 mb-3 font-bold text-[#1a1a1a] leading-tight">Thanks for your feedback 💙</h2>
          <p className="text-[#6b7280] text-lg m-0 mb-6 leading-relaxed">
            We've received it. A team member may reach out if we need more details.
          </p>
          <div className="flex gap-4">
            <button className="custom-btn primary" onClick={() => setStep("rating")}>
              Submit another response
            </button>
          </div>
        </section>
      )}

      <footer className="text-center p-8 text-[#6b7280] mt-8">
        <small className="text-sm">© {new Date().getFullYear()} Blu' Steakhouse. All rights reserved.</small>
        <div className="mt-2">
          <small className="text-xs text-[#9ca3af]">Built by Y12.AI</small>
        </div>
      </footer>
    </div>
  )
}
