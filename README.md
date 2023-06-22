# Atelier

[![build](https://github.com/afrodynamic/atelier/actions/workflows/pr-testing.yml/badge.svg)](https://github.com/afrodynamic/atelier/actions/workflows/pr-testing.yml)

Atelier is a retail website project for Hack Reactor's "Front End Capstone".

## Table of Contents

* [Atelier](#atelier)
  * [Table of Contents](#table-of-contents)
  * [Description](#description)
    * [Product Detail Page](#product-detail-page)
  * [Usage](#usage)
    * [Requirements](#requirements)
    * [Setup and Running](#setup-and-running)
  * [Demo](#demo)

## Description

This project is a complete redesign of a client-facing retail web-portal to address concerns about outdated design and low sales numbers. The new user interface will allow customers to browse items in the retail catalog with ease.

### Product Detail Page

The product detail page will show relevant information for a single product in the catalog. Products are organized by items, and each item can have many sizes and styles resulting in unique SKUs. The product detail page will present items at the product level, and further breakdown by style or size will only be reflected within the product detail page.

The same product detail page will be shown for every product in the catalog. Upon navigating to the product detail page or selecting a new product to display, the contents of the page will update to show information relevant to the selected product.

The item detail page will consist of distinct modules. Each module will display information related to the product being displayed. The following modules have been designated for this project:

* Product Detail / Overview
* Ratings & Reviews
* Questions & Answers
* Related Items & Outfit Creation

## Usage

### Requirements

You will need the following dependencies to run this project:

* `node` / `npm`, to manage project dependencies ([download](https://nodejs.org/en/download))
* `git`, for cloning the project ([download](https://git-scm.com/downloads))

### Setup and Running

To run this project, please follow these steps:

1. Clone the repository to your local machine

   ```shell
   git clone https://github.com/afrodynamic/atelier.git
   ```

2. Navigate to the cloned repository directory

   ```shell
   cd atelier
   ```

3. Install the project's dependencies using `npm install` in the root of the project directory

   ```shell
   npm install
   ```

4. Either run both the client/server together with `npm start`

   ```shell
   npm start
   ```

   or run the client/frontend using `npm run client-dev`

   ```shell
   npm run client-dev
   ```

   and run the server/backend using `npm run server-dev`

   ```shell
   npm run server-dev
   ```

5. Open a browser and navigate to <http://localhost:1234> to view the running project

6. Optionally run the project's `jest` test suite using `npm test`

   ```shell
   npm test
   ```

## Demo

<h3 align="center">Product Overview</h3>

![Product Overview Component](https://drive.google.com/uc?export=download&id=1BfwXDRmw-K1Vu9iZ5zjPOjFEIjhnO5iS)

<h3 align="center">Related Products</h3>

![Related Products Component](https://drive.google.com/uc?export=download&id=1Eyb9vPHqdaz0xg31dUg-G8bh9ThjCLKa)

<h3 align="center">User Saved Outfits</h3>

![Saved Outfits Component](https://drive.google.com/uc?export=download&id=1n6NuEm1XCXfBkZCMWLtd7nSVdDKckDdh)

<h3 align="center">Questions and Answers</h3>

![Questions and Answers Component](https://drive.google.com/uc?export=download&id=1f47zWN6D9jnXUlilvzuFkv9t7efspScO)

<h3 align="center">Ratings and Reviews</h3>

![Ratings and Reviews Component](https://drive.google.com/uc?export=download&id=1mA0i2tV_M9iLDFEAqTYrEWHmU9Al3PAx)
