let myChart = document.getElementById('myChart').getContext('2d');

let massPopChart = new Chart(myChart, {
      type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data:{
        labels:['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford'],
        datasets:[{
          label:'Population',
          data:[
          617594,
          181045,
          153060,
          106519,
          105162,
          95072
          ]
        }, 
        {
          label:'Po3',
          data:[
          517594,
          681045,
          353060,
          206519,
          105162,
          95072
          ]
        }]
      },
      options:{
        maintainAspectRatio: false,
        title:{
          display:true,
          text:'Largest Cities In Massachusetts',
          fontSize:25
        },
        legend:{
          display:true,
          position:'right',
          labels:{
            fontColor:'#000'
          }
        },
        layout:{
          padding:{
            left:50,
            right:0,
            bottom:0,
            top:0
          }
        },
        tooltips:{
          enabled:true
        }
      }
    });


var canvas = document.getElementById("myChart");
var parent = document.getElementById("potato");
//canvas.width =  0.5*parent.offsetWidth;
//canvas.height = parent.offsetHeight;

$(function() {
    $('#thebutton').click(function() {
        $.ajax({
            url: '/signUpUser',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                console.log(response);
                var asad = document.getElementById("theplace")
                asad.innerHTML = "Got it"
                massPopChart.data.datasets[0].data = response.datas
                massPopChart.update();
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

$(function() {
    $(document).ready(function() {
        $.ajax({
            url: '/teamdropdown',
            data: "{}",
            type: 'GET',
            success: function(response) {
                console.log(response);
                dropss = response.drops
                var asad = document.getElementById("TeamSelect")
                var s = '<option value="-1">Please Select a Team</option>';  
               for (var i = 0; i < dropss.length; i++) {  
                   s += '<option value="' + dropss[i] + '">' + dropss[i] + '</option>';  
               }  
              
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

