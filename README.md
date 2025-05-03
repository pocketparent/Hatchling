
## Environment Variables

This project uses environment variables for configuration, particularly for sensitive keys like the OpenAI API key.

1.  **Create a `.env` file:** Copy the `.env.example` file to a new file named `.env` in the project root.
    ```bash
    cp .env.example .env
    ```
2.  **Add your keys:** Edit the `.env` file and add your `OPENAI_API_KEY`.
    ```
    OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```
3.  **CI/CD (GitHub Actions):** For deployment environments like GitHub Actions, ensure the `OPENAI_API_KEY` is configured as a Repository Secret. The key will then be available as an environment variable in the workflow.

*Note: The `.env` file is included in `.gitignore` and should never be committed to the repository.*

