<script lang="ts">
  import { GuestService } from "./GuestService";
  import { onMount } from "svelte";
  import { apiUrl, axiosPost, getReadableDate, imageExists } from "./utils";
  import type { Prompt } from "./prompt.interface";
  let guestService = new GuestService();

  export let name: string;
  let userId;
  let prompts = [] as Prompt[];
  onMount(async () => {
    userId = guestService.identifyGuest();
    prompts = await getPrompts();
    prompts = prompts.filter(async prom => await imageExists(prom.images[0]));
  });

  let promptText;
  let loading = false;
  let promptsLoading = true;

  async function getPrompts() {
    try {
      let url = apiUrl + "prompts/all-prompts";
      let formData = {
        userId,
      };
      let results = await axiosPost(url, formData);
      promptsLoading = false;
      return results;
    } catch (error) {
      promptsLoading = false;
      console.log(error);
      window.alert("an error occured " + error.message);
    }
  }

  async function sendPrompt() {
    try {
      loading = true;
      let url = apiUrl + "prompts";
      let formData = {
        promptText,
        userId,
      };
      let results = await axiosPost(url, formData);
      loading = false;
      window.open(results.data.payment_url, "_self");
    } catch (error) {
      loading = false;
      console.log(error);
      window.alert("an error occured " + error.message);
    }
  }
</script>

<main>
  <h1 class="title">Welcome to imaginer</h1>
  <p class="intro-txt">
    Let your imagination flow. Generate any image you want, at a cost obviously
  </p>
  <p class="intro-txt">
    Laissez libre cours à votre imagination. Générez n'importe quelle image que
    vous voulez, a un prix biensur
  </p>
  <div class="form-container">
    <p class="nb">
      <span class="red">NB:</span> Votre requete doit être saisie en anglais, Rafraîchir la page en cas de problème, (100 frs/image)
    </p>
    <form
      class="prompt-form flex-justify-center"
      on:submit|preventDefault={sendPrompt}
    >
      <input
        type="text"
        name="prompt"
        id=""
        class="prompt-in in"
        bind:value={promptText}
        placeholder="an artistic render of a fox made of fire"
        required
      />
      <button type="submit" class="submit-btn">Generate image</button>
    </form>
    {#if loading}
      <div class="lds-hourglass" />
    {/if}
  </div>
  <div class="imgs-container">
    {#each prompts as prompt, i}
      {#if i == 0}
      <div class="img-container">
        <h2 class="prompt-txt">{prompt.text}</h2>
        {#if prompt.failure_reason}
        <h5 class="error">{prompt.failure_reason}</h5>
        {/if}
        {#if prompt.images.length > 0}
        <img
        src={prompt.images[0]}
        alt={prompt.text}
      />
        {/if}
        <h6 class="date">{getReadableDate(prompt.createdAt)}</h6>
      </div>
      {/if}
    {/each}
  </div>
  {#if promptsLoading}
    <div class="loader-container">
      <div class="lds-grid">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  {/if}
</main>

<style lang="scss">
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    @media (max-width: 640px) {
      padding: 0;
    }
  }
  .test {
    .green {
      color: green;
    }
  }

  .title {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 400;
    margin-bottom: 20px;
    @media (max-width: 640px) {
      font-size: 2rem;
    }
  }
  .intro-txt {
    font-weight: 300;
    font-size: 1rem;
    @media (max-width: 640px) {
      font-size: 0.9rem;
    }
  }

  .form-container {
    margin-top: 30px;
    margin-bottom: 30px;
    width: 100%;
    .nb {
      margin-bottom: 20px;
      .red {
        color: red;
      }
    }
    .prompt-form {
      width: 70%;
      margin: 0 auto;
      padding: 20px;
      box-shadow: 2px 2px 10px 1px rgb(236, 236, 236);
      background-color: white;
      border-radius: 20px;
      justify-content: center;
      .in {
        width: 75%;
        border-radius: 25px;
        margin-right: 10px;
        height: 45px;
        padding-left: 5px;
      }
      .submit-btn {
        background-color: #ff3e00;
        color: white;
        width: auto;
        border: 1px solid #ff3e00;
      }
      @media (max-width: 640px) {
        width: 95%;
        padding: 10px;
        .in {
          height: 40px;
          font-size: 0.8rem;
        }
        .submit-btn {
          width: 19%;
          font-size: 0.6rem;
        }
      }
    }
    .lds-hourglass {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-hourglass:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 8px;
  box-sizing: border-box;
  border: 32px solid #fff;
  border-color: #ff3e00 transparent #ff3e00 transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}

  }

  .imgs-container {
    width: 100%;
    .img-container {
      background-color: white;
      padding: 15px;
      border-radius: 15px;
      width: 100%;
      margin-bottom: 20px;
      .prompt-txt {
        font-size: 1.2rem;
        text-align: left;
        margin-bottom: 10px;
      }
      .error {
        color: red;
        text-align: left;
      }
      .date {
        font-weight: 200;
        text-align: left;
      }
      img {
        width: 100%;
      }
    }
    @media (min-width: 640px) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .img-container {
        width: 30%;
        margin-right: 5px;
      }
    }
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .loader-container {
    .lds-grid {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .lds-grid div {
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ff3e00;
      animation: lds-grid 1.2s linear infinite;
    }
    .lds-grid div:nth-child(1) {
      top: 8px;
      left: 8px;
      animation-delay: 0s;
    }
    .lds-grid div:nth-child(2) {
      top: 8px;
      left: 32px;
      animation-delay: -0.4s;
    }
    .lds-grid div:nth-child(3) {
      top: 8px;
      left: 56px;
      animation-delay: -0.8s;
    }
    .lds-grid div:nth-child(4) {
      top: 32px;
      left: 8px;
      animation-delay: -0.4s;
    }
    .lds-grid div:nth-child(5) {
      top: 32px;
      left: 32px;
      animation-delay: -0.8s;
    }
    .lds-grid div:nth-child(6) {
      top: 32px;
      left: 56px;
      animation-delay: -1.2s;
    }
    .lds-grid div:nth-child(7) {
      top: 56px;
      left: 8px;
      animation-delay: -0.8s;
    }
    .lds-grid div:nth-child(8) {
      top: 56px;
      left: 32px;
      animation-delay: -1.2s;
    }
    .lds-grid div:nth-child(9) {
      top: 56px;
      left: 56px;
      animation-delay: -1.6s;
    }
    @keyframes lds-grid {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  }
</style>
