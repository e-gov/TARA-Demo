/*
  Haarab salasõna ja suunab TARA-sse (paigaldises TOODANG)
*/
$('#ProoviNupp').click(() => {
  var salasona = $('#Salasona').val();
  window.open('https://tara-demo.herokuapp.com/auth?scope=all&salasona=' + salasona);
});
