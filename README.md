# 🌸 Flower Shop - Modern Floral Boutique

A sleek, high-performance landing page for a flower shop, built using **React**, **TypeScript**, **Vite**, and **Firebase**. This project focuses on a professional CI/CD pipeline, component-based architecture, and type-safe development.

[**✨ Live Demo**](https://flower-shop-44943.web.app/)

---

## 📸 Preview

![Project Screenshot](https://raw.githubusercontent.com/HoroNeia/flower-shop/src/assets/screenshot.png)
_(Note: Ensure 'screenshot.png' is in your main folder to see it here!)_

---

## 🚀 Web Engineering Features (CI/CD)

This project implements a professional **Automated Pipeline** to ensure code quality and seamless deployment:

- **Continuous Integration (CI):** Every push and Pull Request is automatically audited.
  - **Linting:** Checks for unused variables and code style consistency.
  - **Type Checking:** Strict TypeScript compilation ensures no data-type errors.
- **Continuous Deployment (CD):** Validated code is automatically deployed to **Firebase Hosting** only after passing all tests.
- **Gatekeeping:** If a commit contains errors, the deployment is automatically rejected, protecting the live site from breaking.

---

## 🛠️ Tech Stack

- **React 18:** For building the interactive user interface.
- **TypeScript:** For robust, static type checking.
- **Vite:** High-performance build tooling.
- **Firebase Hosting:** Global CDN for fast and secure delivery.
- **GitHub Actions:** Automating the CI/CD pipeline and environment sync.
- **Tailwind CSS:** Modern, utility-first styling.

---

## 📂 Getting Started

### Prerequisites

- **Node.js:** v22.0.0 or higher (LTS recommended).
- **npm:** v10.0.0 or higher.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/HoroNeia/flower-shop.git](https://github.com/HoroNeia/flower-shop.git)
    cd flower-shop
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

### 🌸 Environment Note

The project is currently synchronized with **Node.js 22 LTS** across all GitHub Action workflows to ensure a stable and modern deployment environment.
