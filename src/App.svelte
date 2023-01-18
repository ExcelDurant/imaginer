<script lang="ts">
  import { GuestService } from "./GuestService";
  import { onMount } from "svelte";
  import { apiUrl, axiosPost } from "./utils";
  let guestService = new GuestService();

  export let name: string;
  let userId;
  onMount(async () => {
    userId = guestService.identifyGuest();
  });

  let promptText;
  let loading = false;

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
    Let your imagination flow. Generate any image you want
  </p>
  <p class="intro-txt">
    Laissez libre cours à votre imagination. Générez n'importe quelle image que
    vous voulez
  </p>
  <div class="form-container">
    <p class="nb">
      <span class="red">NB:</span> Votre requete doit être saisie en anglais
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
      <p class="loading">loading...</p>
    {/if}
  </div>
  <div class="imgs-container">
	<div class="img-container">
		<img src="https://cdn.atomisystems.com/uploads/2022/07/remove-white-background.png" alt="">
	</div>
  </div>
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
  }

  .imgs-container {
	width: 100%;
	.img-container {
		width: 100%;
		img {
			width: 100%;
		}
	}
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
