## AI powered Code Search for React codebases (JS/TS) by Wizi AI

**We are launching our Code Search feature as an open-source project for frontend teams to enjoy instant natural language search in React (JS/TS) codebases.**

> **Note**
> **that this is a self-hosted tool that uses Vercel, OpenAI and Pinecone. All of these tools have generous free tiers which should be more than enough for you to try Code Search. For reference, indexing a mid-sized React repo should cost $1-2 on average.**


https://user-images.githubusercontent.com/25925393/221127958-953ff4cd-60ff-4c19-83b1-24ff03977063.mp4


### Setup

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwizi-ai%2Fcode-search&env=NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN,OPENAI_API_KEY,PINECONE_API_KEY,PINECONE_BASE_URL&envDescription=Code%20Search%20by%20Wizi%20AI%20uses%20Github%2C%20OpenAI%2C%20and%20Pinecone%20to%20make%20instant%20search%20work.%20Please%20refer%20to%20https%3A%2F%2Fgithub.com%2Fwizi-ai%2Fcode-search%23readme%20for%20instructions.&envLink=https%3A%2F%2Fgithub.com%2Fwizi-ai%2Fcode-search%23environment-variables&project-name=wizi-ai-code-search&repository-name=wizi-ai-code-search&demo-title=Code%20Search%20by%20Wizi%20AI&demo-description=Code%20Search%20for%20React%20codebases%20(JS%2FTS)%20in%20natural%20language.&demo-url=https%3A%2F%2Fdemo.wizi.ai%2F&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2Fwizi-ai%2Fcode-search%2Fmain%2Fcode-search-example.png)

1. Double click on the button above and open the link in a new tab.
2. Note that we use Vercel to deploy and host this for your convenience instead of setting up locally.
3. Now let's add 4 ENV variables.
4. Generate Github Personal Access Token: [https://github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)
5. Generate OpenAI API Token: [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
6. Generate Pinecone API Token: [https://app.pinecone.io/](https://app.pinecone.io/)
7. Also in Pinecone, create a new index: `{name: 'wizi-ai-code-search', dimensions: 1536, metric: 'cosine', pod_type: 'P1'}`
8. Extract base url string under the title. Ex: `wizi-ai-code-search-7874c84.svc.us-east1-gcp.pinecone.io`.
9. Add this url as `PINECONE_BASE_URL` in Vercel setup. **Important to add `https://` prefix to the string, so that your `PINECONE_BASE_URL` env variable is in the similar to `https://wizi-ai-code-search-7874c84.svc.us-east1-gcp.pinecone.io`**
10. Hit deploy. Should take less than two minutes. Once complete, you will have a link to your app. Congrats!

