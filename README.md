# Virtual Machine Runner

A sleek, modern web dashboard to manage your virtual machine instances on Excloud. Built with Next.js 15, Shadcn UI, and Tailwind CSS.

## 🚀 Features

- **Secure Login:** Access control using hardcoded credentials stored in environment variables.
- **VM Management:** Start, Stop, and Restart your VM instances with a single click.
- **Real-time Status:** View the current lifecycle state (Running, Stopped, etc.) of your VM.
- **Credentials Persistence:** VM ID, Bearer Token, and Login credentials are saved in your browser for a seamless experience.
- **Session Security:** 24-hour session persistence using secure cookies.
- **Modern UI:** Responsive design with a clean aesthetic and intuitive controls.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Notifications:** [Sonner](https://sonner.stevenly.me/)

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/raghavdwd/vm-runner.git
   cd vm-runner
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your login credentials:

   ```env
   APP_USERNAME="your_app_username"
   APP_PASSWORD="your_app_password"
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🖥️ Usage

1. **Login:** Use the credentials configured in your `.env` file.
2. **Setup:** Enter your **VM ID** and your Excloud **Bearer Token**.
3. **Control:** Use the action buttons to manage your VM. The status will update automatically after each action.
4. **Refresh:** Use the "Refresh" button next to the status badge to pull the latest state manually.

## 🔒 Security Note

This application stores your VM ID and Bearer Token in `localStorage`. For production use, ensure you are accessing the dashboard over HTTPS. The authentication cookie is set as `httpOnly` to prevent XSS attacks.

---

Built for managing VMs with speed and simplicity.
