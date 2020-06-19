let myChart = document.getElementById('myChart').getContext('2d');

let massPopChart = new Chart(myChart, {
      type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data:[]            ,options:{
        maintainAspectRatio: false,
        title:{
          display:true,
          text:'Metrics',
          fontSize:25
        },
        scales: {
        yAxes: [{ 
          scaleLabel: {
            display: true,
            labelString: "DotPercentage"
          }, 
          display: true,
            ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                // OR //
                beginAtZero: true   // minimum value will be 0.
            }
        }]
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
          enabled:true,
          callbacks: {
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': ';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }
        }
      }
    }});


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

var playersincluded = 0
var Playerslist = [];
var OverRange = [0,20];
var ByButton = 'None'
var Column1 = 'DotPercentage'
var Column2 = 'StrikeRate'
var DelRange = [0,120]
var initsJSON = {Players: ['V Kohli'], ByButton: ByButton, Column1: Column1,
    Column2: Column2, DelRange: DelRange, OverRange: OverRange}

// Initialisation stuff

console.log(initsJSON)

$(function() {
    $(document).ready(function() {
      //Fills team dropdown
        $.ajax({
            url: '/teamdropdown',
            data: "",
            type: 'POST',
            success: function(response) {
                console.log(response);
                dropss = response.drops
                var asad = document.getElementById("TeamSelect")
                var s = '<option value="-1">Please Select a Team</option>';  
               for (var i = 0; i < dropss.length; i++) {  
                   s += '<option value="' + dropss[i] + '">' + dropss[i] + '</option>';  
               }
               $("#TeamSelect").html(s);  
              
            },
            error: function(error) {
                console.log(error);
            }
        });
        // Fills Metric and Column2 Dropdown
        $.ajax({
            url: '/columndropdown',
            data: "",
            type: 'POST',
            success: function(response) {
                console.log(response);
                columns = response.columns
                var asad1 = document.getElementById("Column1Select")
                var asad2 = document.getElementById("Column2Select")
                var s = '<option value="-1">Please Select a Team</option>';  
               for (var i = 0; i < columns.length; i++) {  
                   s += '<option value="' + columns[i] + '">' + columns[i] + '</option>';  
               }
               $("#Column1Select").html(s);
               $("#Column2Select").html(s);  
              
            },
            error: function(error) {
                console.log(error);
            }
        });

        // Updates initial chart
        console.log(initsJSON)
        $.ajax({
            url: '/datapipe',
            data: JSON.stringify(initsJSON),
            type: 'POST',
            contentType:"application/json",
            success: function(response) {
                console.log(response);
                massPopChart.data = response.chartdata
                massPopChart.update();  
              
            },
            error: function(error) {
                console.log(error);
            }
        })
    });
});

// Fills the Batsman DropDown once team is chosen

$("#TeamSelect").on('change',function(){
    var send = {team : $('#TeamSelect').val()};
    var newOption = $('<option value="1">test</option>');
     $.ajax({
            url: '/batsmandropdown',
            data: send,
            type: 'POST',
            success: function(response) {
                console.log(response);
                dropss = response.players
                var asad = document.getElementById("BatsmanSelect")
                var s = '<option value="-1">Please Select a Batsman</option>';  
               for (var i = 0; i < dropss.length; i++) {  
                   s += '<option value="' + dropss[i] + '">' + dropss[i] + '</option>';  
               }
               $("#BatsmanSelect").html(s);  
              
            },
            error: function(error) {
                console.log(error);
            }
          })
   });


// Updates the Players and adds the player buttons

$("#BatsmanSubmit").click(function(){
  console.log('clicked')
    var Player = $('#BatsmanSelect').val();
    Playerslist.push(Player)
    var old = $("#PlayerList").html()
    playersincluded += 1;
    var Newthing = '<button type="button" class="btn btn-outline-primary" id = "Playerbutton-' + playersincluded.toString() + '">'+ Player+'</button>'
    $("#PlayerList").html(old + " " + Newthing);
   });


// Removes all batsmen when remove clicked

$("#BatsmanRemove").click(function(){
  var st = '#Playerbutton-' + playersincluded.toString()
  $(st).remove();
  playersincluded = playersincluded - 1;
  Playerslist.pop()
  console.log(Playerslist)
   });


// Sends imput request and fills chart
$("#FinalSubmit").click(function(){
  // Create output JSON

  //var Playerslist = [];
  var OverRange = [Number($('#slider-range-value1').html()),Number($('#slider-range-value2').html())];
  var ByButton =  $("input[name='ByOptions']:checked").val()
  var Column1 = $('#Column1Select').val()
  var Column2 = $('#Column2Select').val()
  var DelRange = [Number($('#slider-range-value1-2').html()),Number($('#slider-range-value2-2').html())];
  var outputJSON = {Players: Playerslist, ByButton: ByButton, Column1: Column1,
    Column2: Column2, DelRange: DelRange, OverRange: OverRange}

  // Get request and update graph

  $.ajax({
            url: '/datapipe',
            data: JSON.stringify(outputJSON),
            contentType:"application/json",
            type: 'POST',
            success: function(response) {
                console.log(response);
                massPopChart.data = response.chartdata
                massPopChart.options.scales.yAxes[0].scaleLabel.labelString = outputJSON.Column1 
                massPopChart.update();   
              
            },
            error: function(error) {
                console.log(error);
            }
        })
   });

