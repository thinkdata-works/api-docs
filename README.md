<p align="center">
  Slate build status:
  <br>
  <br>
  <a href="https://travis-ci.org/lord/slate"><img src="https://travis-ci.org/lord/slate.svg?branch=master" alt="Build Status"></a>
</p>

<h2 align="center">Namara API Documentation</h2>

About the Documentation
------------------------------

* **Data API** — Learn how to easily create selection and aggregation views on individual data sets.

* **Query API** — Our team created **NiQL**, a query language specifically for Namara, giving users full SQL-access to the Namara catalog.

* **Editable** — see something inaccurate or unclear? Feel free to submit a PR through github. We'll take a look and bring in any changes that make our documentation better.

* **Built on Slate** — Slate is a way of creating simple, beautiful documentation. Below is what you'll need to run a local version of the documentation (recommended if you plan on submitting a PR).

Getting Started with Slate
------------------------------

### Prerequisites

 - **Linux or macOS** — Windows may work, but is unsupported.
 - **Ruby, version 2.3.1 or newer**
 - **Bundler** — If Ruby is already installed, but the `bundle` command doesn't work, just run `gem install bundler` in a terminal.

### Getting Set Up

From within the cloned directory, initialize and start Slate. You can either do this locally, or with Vagrant:

```shell
# either run this to run locally
bundle install
bundle exec middleman server

# OR run this to run with vagrant
vagrant up
```

You can now see the docs at http://localhost:4567. Whoa! That was fast!

Now that Slate is all set up on your machine, you'll probably want to learn more about [editing Slate markdown](https://github.com/lord/slate/wiki/Markdown-Syntax), or [how to publish your docs](https://github.com/lord/slate/wiki/Deploying-Slate).

If you'd prefer to use Docker, instructions are available [in the wiki](https://github.com/lord/slate/wiki/Docker).

### Note on JavaScript Runtime

For those who don't have JavaScript runtime or are experiencing JavaScript runtime issues with ExecJS, it is recommended to add the [rubyracer gem](https://github.com/cowboyd/therubyracer) to your gemfile and run `bundle` again.
