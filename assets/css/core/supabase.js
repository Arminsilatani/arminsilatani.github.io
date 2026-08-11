/* :::::::::::::::::::::::::: SUPABASE CONFIGURATION :::::::::::::::::::::::::: */

const SUPABASE_URL = "https://vzqicidepdmraygulrey.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_kqRWgOmLISOE2EuLL1s8fw_WN6FJRTI";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);

/* :::::::::::::::::::::::::: CONTACT FORM :::::::::::::::::::::::::: */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  if (!form || !submitBtn) {
    return;
  }

  /* :::::::::::::::::::::::::: SUBMIT :::::::::::::::::::::::::: */

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    /* :::::::::::::::::::::::::: VALIDATION :::::::::::::::::::::::::: */

    if (!name || !email || !message) {
      showFormError("لطفاً فیلدهای ضروری رو پر کن");
      return;
    }

    /* :::::::::::::::::::::::::: EMAIL VALIDATION :::::::::::::::::::::::::: */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormError("ایمیل واردشده معتبر نیست");
      return;
    }

    /* :::::::::::::::::::::::::: LOADING :::::::::::::::::::::::::: */

    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.8";
    submitBtn.textContent = "در حال ارسال...";

    try {
      /* :::::::::::::::::::::::::: SAVE MESSAGE TO SUPABASE :::::::::::::::::::::::::: */

      const { error: insertError } = await supabaseClient
        .from("contact_messages")
        .insert([
          {
            name: name,
            email: email,
            subject: subject || null,
            message: message,
          },
        ]);

      /* :::::::::::::::::::::::::: SUPABASE INSERT ERROR :::::::::::::::::::::::::: */

      if (insertError) {
        console.error("SUPABASE ERROR:", insertError);
        console.error("MESSAGE:", insertError.message);
        console.error("DETAILS:", insertError.details);
        console.error("HINT:", insertError.hint);
        console.error("CODE:", insertError.code);

        submitBtn.textContent = "ارسال پیام ناموفق بود";
        submitBtn.style.opacity = "1";

        setTimeout(function () {
          submitBtn.textContent = "ارسال پیام";
          submitBtn.disabled = false;
        }, 3000);

        return;
      }

      /* :::::::::::::::::::::::::: SEND EMAIL NOTIFICATION :::::::::::::::::::::::::: */

      const { error: emailError } = await supabaseClient.functions.invoke(
        "send-email",
        {
          body: {
            to: "eynakii@gmail.com",
            subject: `پیام جدید از صفحه تماس با من - ${name}`,
            html: `
                            <div
                                dir="rtl"
                                style="
                                    font-family: Arial, sans-serif;
                                    line-height: 1.8;
                                "
                            >
                                <h2>پیام جدید از فرم تماس سایت</h2>
                                <p>
                                    <strong>نام:</strong>
                                    ${name}
                                </p>
                                <p>
                                    <strong>ایمیل:</strong>
                                    ${email}
                                </p>
                                <p>
                                    <strong>موضوع:</strong>
                                    ${subject || "بدون موضوع"}
                                </p>
                                <hr>
                                <p>
                                    <strong>متن پیام:</strong>
                                </p>
                                <p>
                                    ${message}
                                </p>
                            </div>
                        `,
          },
        },
      );

      /* :::::::::::::::::::::::::: EMAIL ERROR :::::::::::::::::::::::::: */

      if (emailError) {
        console.error("EMAIL FUNCTION ERROR:", emailError);
        console.error("EMAIL ERROR MESSAGE:", emailError.message);
      } else {
        console.log("EMAIL SENT SUCCESSFULLY");
      }

      /* :::::::::::::::::::::::::: SUCCESS :::::::::::::::::::::::::: */

      form.reset();
      submitBtn.textContent = "✓ پیام با موفقیت ارسال شد";
      submitBtn.classList.add("submit-btn--sent");
      submitBtn.style.opacity = "1";

      setTimeout(function () {
        submitBtn.textContent = "ارسال پیام";
        submitBtn.classList.remove("submit-btn--sent");
        submitBtn.disabled = false;
      }, 3500);
    } catch (error) {
      console.error("Unexpected contact form error:", error);

      submitBtn.textContent = "خطایی رخ داد؛ دوباره تلاش کنید";
      submitBtn.style.opacity = "1";

      setTimeout(function () {
        submitBtn.textContent = "ارسال پیام";
        submitBtn.disabled = false;
      }, 3000);
    }
  });

  /* :::::::::::::::::::::::::: FORM ERROR :::::::::::::::::::::::::: */

  function showFormError(message) {
    submitBtn.style.animation = "none";
    void submitBtn.offsetHeight;
    submitBtn.style.animation = "shake 0.5s ease";
    submitBtn.textContent = message;

    setTimeout(function () {
      submitBtn.textContent = "ارسال پیام";
      submitBtn.style.animation = "";
    }, 2000);
  }

  /* :::::::::::::::::::::::::: INPUT FOCUS EFFECTS :::::::::::::::::::::::::: */

  const inputs = form.querySelectorAll("input, textarea");

  inputs.forEach(function (input) {
    input.addEventListener("focus", function () {
      const group = input.closest(".form-group");
      if (group) {
        group.classList.add("form-group--focused");
      }
    });

    input.addEventListener("blur", function () {
      const group = input.closest(".form-group");
      if (group) {
        group.classList.remove("form-group--focused");
      }
    });
  });
});
