<template>

  <div>
    <h2>Quiz Button</h2>
   
    <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, index) in players" :key="index">
            <td>{{row.name}}</td>
            <td>{{row.score}}</td>
          </tr>
        </tbody>
    </table>

  </div>
</template>

<script>
  import io from 'socket.io-client';
 
  export default {
    name: 'Index',
    data: () => ({
      players: [],
      socket : io('localhost:3000'),
    }),
    methods: {
      
    },
    mounted(){
      this.socket.on('playersView', (data) => {
        this.players = data;
      });
    },
}
</script>
 
<style scoped>
</style>