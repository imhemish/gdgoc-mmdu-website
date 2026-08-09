"use client";
import React, { useRef, useState, FormEvent } from "react";
import { Send, CheckCircle, AlertTriangle, Link as LinkIcon } from "lucide-react";
import Head from "next/head";

// 👉 Paste your deployed Google Apps Script Web App URL here (see setup guide)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbymrAksdG7pdUn4e0kw2lNYRv4zTmXBw7i-pqPZ_BDX69xOCjp_WHWOymRSOmNyWXI/exec";

const INTEREST_OPTIONS = [
  "App Development",
  "Web Development",
  "AI/ML",
  "Designing",
  "Video Editing",
  "Game Dev",
  "Linux",
  "Systems Programming",
  "IoT",
];

const GRAD_YEAR_OPTIONS = ["2029", "2030", "Other"];
const DEGREE_OPTIONS = ["B.Tech", "BCA", "B.Sc", "Other"];

// Order matters here — it's the order we scroll to the first invalid field in.
const FIELD_ORDER = [
  "name",
  "phone",
  "rollNo",
  "gradYear",
  "gradYearOther",
  "degree",
  "degreeOther",
  "specialisation",
  "hostelStatus",
  "interests",
  "whyJoin",
];

interface FormState {
  name: string;
  phone: string;
  rollNo: string;
  gradYear: string;
  gradYearOther: string;
  degree: string;
  degreeOther: string;
  specialisation: string;
  hostelStatus: string;
  interests: string[];
  whyJoin: string;
  technicalSkills: string;
  github: string;
  linkedin: string;
  contribution: string;
  projects: string;
  resumeLink: string;
}

const initialState: FormState = {
  name: "",
  phone: "",
  rollNo: "",
  gradYear: "",
  gradYearOther: "",
  degree: "",
  degreeOther: "",
  specialisation: "",
  hostelStatus: "",
  interests: [],
  whyJoin: "",
  technicalSkills: "",
  github: "",
  linkedin: "",
  contribution: "",
  projects: "",
  resumeLink: "",
};

const HiringForm = () => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const registerFieldRef = (key: string) => (el: HTMLDivElement | null) => {
    fieldRefs.current[key] = el;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digitsOnly }));
  };

  const handleRollNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, rollNo: digitsOnly }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.interests.includes(interest);
      return {
        ...prev,
        interests: alreadySelected
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll number is required.";

    if (!formData.gradYear) newErrors.gradYear = "Select a graduation year.";
    if (formData.gradYear === "Other" && !formData.gradYearOther.trim()) {
      newErrors.gradYearOther = "Enter your graduation year.";
    }

    if (!formData.degree) newErrors.degree = "Select a degree.";
    if (formData.degree === "Other" && !formData.degreeOther.trim()) {
      newErrors.degreeOther = "Enter your degree.";
    }

    if (!formData.specialisation.trim())
      newErrors.specialisation = "Specialisation is required.";

    if (!formData.hostelStatus)
      newErrors.hostelStatus = "Select hosteller/PG or day scholar.";

    if (formData.interests.length === 0)
      newErrors.interests = "Select at least one area of interest.";

    if (!formData.whyJoin.trim())
      newErrors.whyJoin = "Please tell us why you want to join.";

    return newErrors;
  };

  const scrollToFirstError = (errs: Record<string, string>) => {
    const firstKey = FIELD_ORDER.find((key) => errs[key]);
    if (firstKey) {
      fieldRefs.current[firstKey]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSubmitStatus("idle");
      scrollToFirstError(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    const payload = {
      ...formData,
      gradYear:
        formData.gradYear === "Other" ? formData.gradYearOther : formData.gradYear,
      degree: formData.degree === "Other" ? formData.degreeOther : formData.degree,
      interests: formData.interests.join(", "),
      submittedAt: new Date().toISOString(),
    };

    try {
      // Sent as text/plain to avoid a CORS preflight against Apps Script
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.result !== "success") {
        throw new Error("Failed to submit form");
      }

      setSubmitStatus("success");
      setFormData(initialState);
      setErrors({});
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setSubmitStatus("idle");
  };

  const inputClasses =
    "w-full bg-neutral-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder-gray-500";

  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
  const errorClasses = "text-red-400 text-sm mt-1.5";

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="relative bg-gradient-to-b from-[#0a0a0a] to-[#1e1e1e] min-h-screen w-full py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[size:40px_40px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl relative z-10">
          <div className="bg-neutral-900/80 backdrop-blur-lg border border-gray-800/50 shadow-2xl p-8 sm:p-10 lg:p-12 rounded-3xl">
            {submitStatus === "success" ? (
              /* ---------- Success View ---------- */
              <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16">
                <div className="w-16 h-16 rounded-full bg-green-600/10 border border-green-500/30 flex items-center justify-center mb-6">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 mb-3">
                  Application Submitted
                </h1>
                <p className="text-gray-400 max-w-sm mb-8">
                  Thanks for applying! We've received your details and will
                  let you know the next steps soon.
                </p>
                <button
                  type="button"
                  onClick={handleSubmitAnother}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              /* ---------- Form View ---------- */
              <>
                <div className="text-center mb-8 sm:mb-10">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 mb-3">
                    Join The Club
                  </h1>
                  <p className="text-gray-400 max-w-xl mx-auto">
                    Fill out the form below to apply. We review all applications.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                  {/* ---------- Required Section ---------- */}
                  <div className="grid grid-cols-1 gap-6">
                    {/* Name */}
                    <div ref={registerFieldRef("name")}>
                      <label htmlFor="name" className={labelClasses}>
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="Your Full Name"
                      />
                      {errors.name && <p className={errorClasses}>{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div ref={registerFieldRef("phone")}>
                      <label htmlFor="phone" className={labelClasses}>
                        Phone Number / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        className={inputClasses}
                        placeholder="10-digit Indian mobile number"
                      />
                      {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
                    </div>

                    {/* Roll No */}
                    <div ref={registerFieldRef("rollNo")}>
                      <label htmlFor="rollNo" className={labelClasses}>
                        Roll No.
                      </label>
                      <input
                        type="text"
                        id="rollNo"
                        name="rollNo"
                        inputMode="numeric"
                        value={formData.rollNo}
                        onChange={handleRollNoChange}
                        className={inputClasses}
                        placeholder="Numeric only"
                      />
                      {errors.rollNo && <p className={errorClasses}>{errors.rollNo}</p>}
                    </div>

                    {/* Graduation Year */}
                    <div ref={registerFieldRef("gradYear")}>
                      <label htmlFor="gradYear" className={labelClasses}>
                        Graduation Year
                      </label>
                      <select
                        id="gradYear"
                        name="gradYear"
                        value={formData.gradYear}
                        onChange={handleChange}
                        className={inputClasses}
                      >
                        <option value="" className="bg-neutral-900">
                          Select graduation year
                        </option>
                        {GRAD_YEAR_OPTIONS.map((year) => (
                          <option key={year} value={year} className="bg-neutral-900">
                            {year}
                          </option>
                        ))}
                      </select>
                      {errors.gradYear && (
                        <p className={errorClasses}>{errors.gradYear}</p>
                      )}
                      {formData.gradYear === "Other" && (
                        <div ref={registerFieldRef("gradYearOther")}>
                          <input
                            type="text"
                            name="gradYearOther"
                            value={formData.gradYearOther}
                            onChange={handleChange}
                            className={`${inputClasses} mt-3`}
                            placeholder="Enter your graduation year"
                          />
                          {errors.gradYearOther && (
                            <p className={errorClasses}>{errors.gradYearOther}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Degree */}
                    <div ref={registerFieldRef("degree")}>
                      <label htmlFor="degree" className={labelClasses}>
                        Degree
                      </label>
                      <select
                        id="degree"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        className={inputClasses}
                      >
                        <option value="" className="bg-neutral-900">
                          Select degree
                        </option>
                        {DEGREE_OPTIONS.map((degree) => (
                          <option key={degree} value={degree} className="bg-neutral-900">
                            {degree}
                          </option>
                        ))}
                      </select>
                      {errors.degree && <p className={errorClasses}>{errors.degree}</p>}
                      {formData.degree === "Other" && (
                        <div ref={registerFieldRef("degreeOther")}>
                          <input
                            type="text"
                            name="degreeOther"
                            value={formData.degreeOther}
                            onChange={handleChange}
                            className={`${inputClasses} mt-3`}
                            placeholder="Enter your degree"
                          />
                          {errors.degreeOther && (
                            <p className={errorClasses}>{errors.degreeOther}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Specialisation */}
                    <div ref={registerFieldRef("specialisation")}>
                      <label htmlFor="specialisation" className={labelClasses}>
                        Specialisation
                      </label>
                      <input
                        type="text"
                        id="specialisation"
                        name="specialisation"
                        value={formData.specialisation}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="e.g. CSE, AI & DS, ECE..."
                      />
                      {errors.specialisation && (
                        <p className={errorClasses}>{errors.specialisation}</p>
                      )}
                    </div>

                    {/* Hosteller / Day Scholar */}
                    <div ref={registerFieldRef("hostelStatus")}>
                      <p className={labelClasses}>Hosteller / Day Scholar</p>
                      <div className="flex gap-6">
                        {["Hosteller/PG", "Day Scholar"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 text-gray-300 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="hostelStatus"
                              value={option}
                              checked={formData.hostelStatus === option}
                              onChange={handleChange}
                              className="accent-blue-500 w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                      {errors.hostelStatus && (
                        <p className={errorClasses}>{errors.hostelStatus}</p>
                      )}
                    </div>

                    {/* Area of Interest */}
                    <div ref={registerFieldRef("interests")}>
                      <p className={labelClasses}>Area of Interest</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {INTEREST_OPTIONS.map((interest) => (
                          <label
                            key={interest}
                            className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer bg-neutral-800/40 border border-gray-700/40 rounded-lg px-3 py-2 hover:border-gray-600 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.interests.includes(interest)}
                              onChange={() => handleInterestToggle(interest)}
                              className="accent-blue-500 w-4 h-4 shrink-0"
                            />
                            {interest}
                          </label>
                        ))}
                      </div>
                      {errors.interests && (
                        <p className={errorClasses}>{errors.interests}</p>
                      )}
                    </div>

                    {/* Why join */}
                    <div ref={registerFieldRef("whyJoin")}>
                      <label htmlFor="whyJoin" className={labelClasses}>
                        Why do you want to join the club?
                      </label>
                      <textarea
                        id="whyJoin"
                        name="whyJoin"
                        value={formData.whyJoin}
                        onChange={handleChange}
                        rows={4}
                        className={inputClasses}
                        placeholder="Tell us what draws you to the club..."
                      />
                      {errors.whyJoin && (
                        <p className={errorClasses}>{errors.whyJoin}</p>
                      )}
                    </div>
                  </div>

                  {/* ---------- Optional Section ---------- */}
                  <div className="pt-2">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-px flex-1 bg-gray-800"></div>
                      <span className="text-s uppercase tracking-widest text-white font-bold">
                        Optional Details
                      </span>
                      <div className="h-px flex-1 bg-gray-800"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="technicalSkills" className={labelClasses}>
                          Technical Skills
                        </label>
                        <input
                          type="text"
                          id="technicalSkills"
                          name="technicalSkills"
                          value={formData.technicalSkills}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="e.g. Python, React, Figma..."
                        />
                      </div>

                      <div>
                        <label htmlFor="github" className={labelClasses}>
                          GitHub Profile
                        </label>
                        <input
                          type="url"
                          id="github"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="https://github.com/yourusername"
                        />
                      </div>

                      <div>
                        <label htmlFor="linkedin" className={labelClasses}>
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="https://linkedin.com/in/yourusername"
                        />
                      </div>

                      <div>
                        <label htmlFor="contribution" className={labelClasses}>
                          What can you contribute to the club?
                        </label>
                        <textarea
                          id="contribution"
                          name="contribution"
                          value={formData.contribution}
                          onChange={handleChange}
                          rows={3}
                          className={inputClasses}
                          placeholder="Skills, ideas, time you can commit..."
                        />
                      </div>

                      <div>
                        <label htmlFor="projects" className={labelClasses}>
                          Projects / Previous Experience
                        </label>
                        <textarea
                          id="projects"
                          name="projects"
                          value={formData.projects}
                          onChange={handleChange}
                          rows={3}
                          className={inputClasses}
                          placeholder="Links or brief descriptions of things you've built..."
                        />
                      </div>

                      <div>
                        <label htmlFor="resumeLink" className={labelClasses}>
                          Resume Link / Portfolio Link
                        </label>
                        <input
                          type="url"
                          id="resumeLink"
                          name="resumeLink"
                          value={formData.resumeLink}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="https://..."
                        />
                        <p className="flex items-start gap-1.5 text-xs text-gray-500 mt-2">
                          <LinkIcon size={14} className="shrink-0 mt-0.5" />
                          Have a PDF resume? Upload it to Google Drive, set sharing
                          to "Anyone with the link", then paste that link here.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="w-full text-center mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`
                  group relative w-full sm:w-auto px-8 py-3 rounded-full transition-all duration-300
                  ${
                    isSubmitting
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  }
                  flex items-center justify-center gap-3
                `}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                      <Send
                        size={20}
                        className={`
                    transition-transform duration-300
                    ${isSubmitting ? "opacity-50" : "group-hover:translate-x-1"}
                  `}
                      />
                    </button>
                  </div>

                  {/* Error Message (submission failed, not validation) */}
                  {submitStatus === "error" && (
                    <div className="flex items-center justify-center gap-3 bg-red-600/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-center mt-4">
                      <AlertTriangle size={24} />
                      <span>Failed to submit. Please try again later.</span>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default HiringForm;