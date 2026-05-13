export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="section-header">
        <span className="section-num">03</span>
        <span className="section-line"></span>
        <span className="section-tag">Selected Work</span>
      </div>

      <h2 className="section-title reveal-up">
        Things I've <em className="serif">built</em> & <em className="serif">shipped</em>.
      </h2>

      <div className="project-list">

        <article className="project reveal-up" data-cursor="hover">
          <div className="project-index">01 / 03</div>
          <div className="project-main">
            <div className="project-info">
              <h3 className="project-title">Scale-Ops</h3>
              <p className="project-desc">
                A high-throughput import/export platform built from scratch. Multi-stage Kafka
                pipeline with parallel consumer groups asynchronously processing bulk CSV/XLSX
                imports across <strong>millions of rows</strong> with per-row status tracking.
                Memory-efficient export pipeline via Trino pagination, ExcelJS streaming, and
                AWS S3 multipart uploads — keeping memory stable under load.
              </p>
              <ul className="project-bullets">
                <li><strong>100+ REST APIs</strong> with file validation preview, AWS STS IAM, dual-header auth, soft-delete audit</li>
                <li>BullMQ scheduler with one-time & recurring jobs (Minute → Year) and Redis-powered mid-stream cancellation</li>
                <li>P99 latency tuned via indexes, caching, and connection-pool optimization</li>
                <li>Swagger + Docusaurus documentation ecosystem · health checks · Signoz observability</li>
              </ul>
              <div className="project-stack">
                {['NestJS', 'Kafka', 'BullMQ', 'Redis', 'Trino', 'AWS S3', 'MySQL', 'ExcelJS', 'Docker'].map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
            <div className="project-visual">
              <div className="project-mock">
                <div className="mock-bar"><span></span><span></span><span></span></div>
                <div className="mock-body">
                  <div className="mock-row"><span className="mock-label">imports.products</span><span className="mock-status success">▲ millions of rows</span></div>
                  <div className="mock-row"><span className="mock-label">consumer.group_1</span><span className="mock-status running">processing</span></div>
                  <div className="mock-row"><span className="mock-label">consumer.group_2</span><span className="mock-status running">processing</span></div>
                  <div className="mock-row"><span className="mock-label">consumer.group_3</span><span className="mock-status">idle</span></div>
                  <div className="mock-progress"><div className="mock-progress-bar"></div></div>
                  <div className="mock-row small"><span>p99 latency</span><span>↓ 60%</span></div>
                  <div className="mock-row small"><span>uptime</span><span>99.9%</span></div>
                  <div className="mock-row small"><span>memory</span><span>stable under load</span></div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="project reveal-up" data-cursor="hover">
          <div className="project-index">02 / 03</div>
          <div className="project-main reverse">
            <div className="project-info">
              <h3 className="project-title">ReelStyleFinder</h3>
              <p className="project-desc">
                An AI-powered Instagram automation that turns DMs of reels, videos, and images
                into product recommendations. Processes media via Meta Graph APIs, detects
                outfits with <strong>YOLOv8</strong>, and uses <strong>Gemini</strong> to surface
                relevant Indian e-commerce links — delivered back through Instagram DMs in
                seconds.
              </p>
              <ul className="project-bullets">
                <li>End-to-end Meta Graph API integration with webhook processing, business verification, and app review</li>
                <li>YOLOv8 outfit & full-body detection + Meta Quick Replies for image selection</li>
                <li>Gemini-powered filtering for relevant Indian product discovery</li>
                <li>Responsive Next.js analytics dashboard with live processing metrics & user activity</li>
                <li>Microservices architecture with zero-downtime deploys on EC2/Nginx</li>
              </ul>
              <div className="project-stack">
                {['NestJS', 'Next.js', 'Meta Graph API', 'YOLOv8', 'Python', 'Flask', 'Gemini'].map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
            <div className="project-visual">
              <div className="project-mock phone">
                <div className="phone-screen">
                  <div className="phone-header">
                    <div className="phone-avatar"></div>
                    <div>
                      <div className="phone-name">@you</div>
                      <div className="phone-sub">active now</div>
                    </div>
                  </div>
                  <div className="phone-msg in">📹 sent a reel</div>
                  <div className="phone-msg out">Detecting outfit…</div>
                  <div className="phone-msg out">Found 3 looks — pick one ✨</div>
                  <div className="phone-quick">
                    <span>Look 1</span><span>Look 2</span><span>Look 3</span>
                  </div>
                  <div className="phone-msg out">Here are the products 🛍️</div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="project reveal-up" data-cursor="hover">
          <div className="project-index">03 / 03</div>
          <div className="project-main">
            <div className="project-info">
              <h3 className="project-title">Med-Connect</h3>
              <p className="project-desc">
                A full-stack <strong>doctor appointment platform</strong> bringing patients,
                doctors, and clinic admins onto a single system. Patients discover doctors by
                specialty, view real-time availability, and book appointments in seconds —
                while doctors manage their schedule and admins oversee the entire ecosystem
                from a unified dashboard.
              </p>
              <ul className="project-bullets">
                <li><strong>Three-tier role system</strong> — separate flows for Patients, Doctors, and Admins with secure JWT auth & RBAC</li>
                <li><strong>Admin dashboard</strong> with doctor onboarding, appointment moderation, analytics, and revenue tracking</li>
                <li><strong>Doctor profile</strong> with specialty, qualifications, slot management, calendar sync, and patient history</li>
                <li><strong>Patient profile</strong> with medical history, prescriptions, upcoming bookings, and ratings/reviews</li>
                <li>Real-time slot locking to prevent double-booking + email/SMS reminders for upcoming visits</li>
                <li>Responsive Next.js UI optimized for both desktop clinic use and on-the-go patient access</li>
              </ul>
              <div className="project-stack">
                {['Next.js', 'NestJS', 'TypeScript', 'MySQL', 'Redis', 'JWT', 'RBAC', 'Tailwind', 'Cron Jobs'].map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
            <div className="project-visual">
              <div className="project-mock appt">
                <div className="mock-bar"><span></span><span></span><span></span></div>
                <div className="appt-body">
                  <div className="appt-doctor">
                    <div className="appt-avatar">👨‍⚕️</div>
                    <div className="appt-doctor-info">
                      <div className="appt-doctor-name">Dr. Aarav Patel</div>
                      <div className="appt-doctor-spec">Cardiologist · 12 yrs exp</div>
                      <div className="appt-rating">★ 4.9 · 312 reviews</div>
                    </div>
                  </div>

                  <div className="appt-section-label">Select date</div>
                  <div className="appt-dates">
                    <div className="appt-date"><span>MON</span><strong>12</strong></div>
                    <div className="appt-date active"><span>TUE</span><strong>13</strong></div>
                    <div className="appt-date"><span>WED</span><strong>14</strong></div>
                    <div className="appt-date"><span>THU</span><strong>15</strong></div>
                    <div className="appt-date"><span>FRI</span><strong>16</strong></div>
                  </div>

                  <div className="appt-section-label">Available slots</div>
                  <div className="appt-slots">
                    <span>09:00</span>
                    <span className="active">10:30</span>
                    <span>11:15</span>
                    <span className="booked">02:00</span>
                    <span>03:30</span>
                    <span>04:45</span>
                  </div>

                  <button className="appt-cta">
                    <span>Confirm Appointment</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

      </div>
    </section>
  );
}
