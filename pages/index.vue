<script setup>
const firebaseUser = useFirebaseUser();
</script>

<template>
  <div class="HomeLayout">
    <!-- <pre>{{ firebaseUser }}</pre> -->
    <!-- <pre>{{ useFirebaseUser() }}</pre> -->
    <!-- <AppAuth v-if="!firebaseUser" /> -->

    <div class="HomeWrap">
      <div class="HomeOptions">
        <!-- <pre>{{ $pinia.state }}</pre> -->
        <!-- <button
        v-if="firebaseUser"
        @click="firebaseUser.displayName = 'buduskito'"
      >
        buduskito
      </button> -->
        <NuxtLink class="PlayBanner PlayOnline ContentLeft" to="/play-online/">
          <div class="bannerContainer simulateEmboss">
            <div class="bgImage" />
            <div class="bgGradient" />
            <div class="bgSpotlight" />
          </div>
          <div class="bannerContainer">
            <div class="bgImage" />
            <div class="bgGradient" />
            <div class="bgSpotlight" />
            <div class="bannerBody">
              <div class="bannerContent">
                <!-- <div class="title content_title">BINGO Online</div> -->
                <!-- <div class="title content_title">Online<br />BINGO</div> -->
                <div class="title content_title">Online BINGO</div>
                <div class="content_copy">
                  Create or join a room to play with family and friends.
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
        <NuxtLink
          class="PlayBanner PlayOffline ContentRight"
          to="/offline-caller/"
        >
          <div class="bannerContainer simulateEmboss">
            <div class="bgImage" />
            <div class="bgGradient" />
            <div class="bgSpotlight" />
          </div>
          <div class="bannerContainer">
            <div class="bgImage" />
            <div class="bgGradient" />
            <div class="bgSpotlight" />
            <div class="bannerBody">
              <div class="bannerContent">
                <!-- <div class="title content_title">Offline BINGO</div> -->
                <div class="title content_title">BINGO Caller</div>
                <div class="content_copy">
                  Make your local play session a blitz with our BINGO Caller
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.HomeLayout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  container-type: inline-size;
}

.HomeWrap {
  container-type: inline-size;
  width: 90%;
  max-width: min(60cqh, 100cqw);
  margin-inline: auto;
}

.HomeOptions {
  font-size: 3.5cqw;
  --gap: 1em;
  --gap: 1.5em;
  --border-radius: var(--gap);
  display: grid;
  gap: 1.5em;
  align-content: center;
}

.PlayOnline {
  --background-image: url(~/assets/img/banner-online.jpg);
}

.PlayOffline {
  --background-image: url(~/assets/img/banner-offline.jpg);
}

.PlayBanner {
  --banner-emboss: 0.5em;
  --bg-move: 30%;
  --bg-move: 27%;
  --clear-pad: 40%;
  --flare-move-x: 5%;
  --flare-move-x: 6%;
  --flare-move-x: 7%;
  --flare-move-x: 8%;
  // --flare-move-x: 10%;
  // --flare-move-x: 20%;
  // --flare-move-x: 15%;
  // --flare-move-x: 22%;
  background-color: #000;
  display: block;
  border-radius: var(--border-radius);
  overflow: hidden;
  position: relative;
  box-shadow: 0em 0.25em 0.75em 0.25em rgba(0, 0, 0, 0.4);
  display: grid;
  padding-bottom: var(--banner-emboss);
  .bannerContainer {
    position: relative;
    width: 100%;
    padding-bottom: 50%;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0em 0em var(--banner-emboss) calc(var(--banner-emboss) / 2)
      rgba(0, 0, 0, 0.4);
    &.simulateEmboss {
      position: absolute;
      bottom: 0;
      .bgImage {
        filter: blur(2px);
        filter: blur(2px) brightness(1.5) sepia(0.5);
        filter: blur(4px) brightness(1.5) sepia(0.5);
        filter: blur(4px) brightness(1.5) sepia(0.5);
        // scale: 1.1;
      }
      &::after {
        border-radius: var(--border-radius);
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        box-shadow: inset 0em calc(var(--banner-emboss) * -1) 0em 0em
          rgba(0, 0, 0, 0.5);
      }
    }
  }

  .bgSpotlight {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    padding-top: 100%;
    background: radial-gradient(
      circle,
      rgba($color-red-bright, 65%) 10%,
      rgba(0, 0, 0, 0) 70%
    );
    background: radial-gradient(
      circle,
      rgba($color-orange-bright, 65%) 10%,
      rgba(0, 0, 0, 0) 70%
    );
    scale: 1.5;
    scale: 1.25;
    // top: 50%;
    bottom: 0;
    transform: translateX(var(--flare-side-move, var(--flare-move-x)));
  }
  .bannerBody {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    // width: 60%;
    padding: 1.5em;
    color: #fff;
    display: flex;
    align-items: center;
    /* prettier-ignore */
    box-shadow:
      inset 0 1px 1px 0 rgba(#fff, 30%),
      inset 0 -1px 1px 0 rgba(#000, 50%);
    border-radius: var(--border-radius);
  }
  .bgImage {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: var(--background-image);
    background-position: center center;
    background-size: cover;
  }
  .bgGradient {
    border-radius: var(--border-radius);
    position: absolute;
    width: 100%;
    height: 100%;
    $bg-light: #6108b4;
    $bg-light: #4a08b4;
    background-color: $bg-light;
    // border: 1px solid white;
    background: linear-gradient(65deg, $bg-light 40%, rgba($bg-light, 0) 85%);
    background: linear-gradient(105deg, $bg-light 40%, rgba($bg-light, 0) 85%);
    scale: 1.1;
  }
  .bannerContent {
    position: relative;
    z-index: 1;
  }
  .content_title {
    font-weight: bold;
    font-size: 2em;
    line-height: 1.1;
    margin-bottom: 0.5em;
    text-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.4);
  }
  .content_copy {
    text-wrap: balance;
  }
}

.ContentLeft {
  background-position-x: -150%;
  .bannerContainer {
    padding-bottom: 60%;
  }
  .bgImage {
    left: var(--bg-move);
  }
  .bgSpotlight {
    --flare-side-move: calc(var(--flare-move-x) * -1);
  }
  .bannerBody {
    // left: 0;
    &::before {
      right: var(--bg-move);
      right: calc(var(--bg-move) * 2);
    }
  }
  .bannerContent {
    padding-right: var(--clear-pad);
  }
}

.ContentRight {
  background-position-x: 150%;
  .bannerContainer {
    padding-bottom: 35%;
  }
  .bgImage {
    right: var(--bg-move);
  }
  .bgGradient {
    rotate: 180deg;
    right: 0;
  }
  .bgSpotlight {
    --flare-side-move: var(--flare-move-x);
  }
  .bannerBody {
    // right: 0;
    text-align: right;
    &::before {
      left: var(--bg-move);
      left: calc(var(--bg-move) * 2);
    }
  }
  .bannerContent {
    padding-left: var(--clear-pad);
  }
}

@media (orientation: landscape) {
  .HomeWrap {
    max-width: 100cqmin;
  }
  .HomeOptions {
    grid-template-columns: repeat(2, 1fr);
    font-size: 1.875cqw;
  }
}

@media (orientation: portrait) {
  .PlayOnline {
    .content_title {
      font-size: 3em;
      font-size: 3.25em;
    }
  }

  .PlayOffline {
    .content_title {
      font-size: 1.875em;
    }
  }
}
</style>
