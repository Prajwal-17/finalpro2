function Awareness() {
  return (
    <div className="bg-slate-950">
      <section className="border-b border-slate-900 bg-deep-blue">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h1 className="text-center text-4xl font-bold text-slate-100">
            POCSO Awareness Hub
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Quick references, SOS pathways, and legal resources to help adults
            and children act swiftly under the POCSO Act.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-12 px-4 py-16 text-slate-300 sm:px-6">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg shadow-slate-950/40">
          <h2 className="text-2xl font-semibold text-slate-100">
            Know the Signs &amp; Respond
          </h2>
          <p className="mt-4 text-slate-400">
            Children may communicate distress through behavioural changes,
            avoidance, or sudden regression. Build trust, listen without
            judgement, and involve trained counsellors early.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-400">
            <li>• Encourage open conversations about safe and unsafe touch.</li>
            <li>• Document incidents carefully and preserve digital evidence.</li>
            <li>
              • Notify local law enforcement or Child Welfare Committee as
              mandated.
            </li>
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg shadow-slate-950/40">
          <h2 className="text-2xl font-semibold text-slate-100">
            SOS &amp; Support Channels
          </h2>
          <p className="mt-4 text-slate-400">
            Immediate help is essential. Keep these helplines accessible to
            children, caregivers, and school staff at all times.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <h3 className="text-lg font-semibold text-emerald-300">
                Emergency Services
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Dial 112 for police, fire, or medical response.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <h3 className="text-lg font-semibold text-sky-300">
                Childline 1098
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                24/7 national helpline connecting children to emergency support.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <h3 className="text-lg font-semibold text-rose-300">
                Legal Aid (NALSA)
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {/* TODO: Link to official NALSA resources */}
                Refer to NALSA&apos;s district legal services directory for
                pro-bono assistance.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <h3 className="text-lg font-semibold text-amber-300">
                Counselling Support
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Pair trained counsellors with guardians to support the child&apos;s
                wellbeing.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg shadow-slate-950/40">
          <h2 className="text-2xl font-semibold text-slate-100">
            Legal Pathways Under POCSO
          </h2>
          <p className="mt-4 text-slate-400">
            The Protection of Children from Sexual Offences (POCSO) Act mandates
            child-friendly reporting and prosecution. Ensure compliance with
            timelines for FIR filing, medical examination, and special court
            proceedings.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-400">
            <li>
              • Section 19: Mandatory reporting by any person aware of an offence.
            </li>
            <li>
              • Section 24: Child-friendly evidence recording through special
              educators.
            </li>
            <li>
              • Section 40: Support persons to assist the child throughout the
              legal journey.
            </li>
          </ul>
        </article>

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/40 p-8 text-center shadow-lg shadow-slate-950/30">
          <h2 className="text-2xl font-semibold text-slate-100">
            Awareness Content Coming Soon
          </h2>
          <p className="mt-4 text-slate-400">
            Detailed learning journeys, downloadable toolkits, and parent-teacher
            facilitation guides are under development.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {/* TODO: Replace placeholder with CMS-driven content feed */}
            Content publishing pipeline pending final prompt approval.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Awareness

