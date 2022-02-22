<template>
    <div>
      <v-container style="display: flex; justify-content:center">
            <v-sheet
              color="#f5f5f5"
              height="70vh"
              outlined
              rounded
              elevation="1"
              width="60vw">
              <h1 style="text-align: center; margin-top: 10vh">Login</h1>
              <div style="display: flex; justify-content: center; margin-top: 5vh">
                <div style="width: 30vw">
                   <v-banner
                    color="#eecccc"
                    elevation="2"
                    rounded
                    single-line
                    v-if="loginFail"
                    style="margin-bottom: 30px">
                      <v-icon>mdi-account</v-icon> Incorrect Username or Password
                    </v-banner>
                  <form @submit="login">
                  <v-text-field
                    style="width:100%"
                    label="Username"
                    outlined
                    v-model="username"
                  ></v-text-field>
                   <v-text-field
                    style="width: 100%"
                    label="Password"
                    type="password"
                    outlined
                    v-model="password"
                  ></v-text-field>
                  <v-btn
                    block
                    color="primary"
                    type="submit">
                    Submit
                  </v-btn>
                  </form>
                </div>
              </div>
            </v-sheet>
      </v-container>
    </div>
</template>

<script>

export default {
  name: 'Login',

  components: {
  },

  data: () => {
    return {
      username: "",
      password: "",
      loginFail: false
    }
  },
  
  methods: {
    async login( e ) {
      e.preventDefault();
      const res = await fetch('api/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( {username: this.username, password: this.password})
      });
      if( res.status === 200 ){
        this.$emit('loginSuccess')
      }
      else {
        this.loginFail = true;
      }
    }
  }
};
</script>
<style>
.application {
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}
</style>