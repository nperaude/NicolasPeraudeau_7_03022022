<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap");
* {
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  width: 100%;
  min-height: 100vh;
}
body {
  background-image: linear-gradient(
    62deg,
    #203e70 0%,
    #503a58 80%,
    #83363e 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.logo {
  width: 400px;
  margin-top: 3vh;
}

.button {
  background: #2196f3;
  color: white;
  border-radius: 26px;
  font-weight: 800;
  font-size: 25px;
  border: none;
  width: 100%;
  padding: 20px;
  transition: 0.4s;
}

.button:hover {
  cursor: pointer;
  background: #1976d2;
}

.button--disabled {
  background: #cecece;
  color: #ececec;
}

.button--disabled:hover {
  cursor: not-allowed;
  background: #cecece;
}

.posts {
  background-color: #ffffff;
  width: 70%;
  margin-top: 10vh;
  min-height: 100vh;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 60px 60px 0px 0px;
  padding: 20px;
}
</style>
