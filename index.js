

let chatDataEnum = new Map()
chatDataEnum.set('Artemis-motorway-130', ArtemisMotorway130)
chatDataEnum.set('Artemis-rural', ArtemisRural)
chatDataEnum.set('Artemis-urban', ArtemisUrban)
chatDataEnum.set('CLTC_P', CLTC_P)
chatDataEnum.set('HWFET', HWFET)
chatDataEnum.set('JC08', JC08)
chatDataEnum.set('LA92', LA92)
chatDataEnum.set('NYCC', NYCC)
chatDataEnum.set('UDDS', UDDS)
chatDataEnum.set('US06', US06)
chatDataEnum.set('WLTC', WLTC)


let BasCYC_DropDown
let constSpeedData = []
let TgtCYC_DropDown

let BasCYC_Plot = []
let TgtCYC_Plot = []

let BEV_DropDown_GECR = []
let BEV_DropDown_para = []

// let ECR_CLTC = []
// let ECR_Tgt = []
var ECRs_Tgt = []

var TgtCYC_Slider = 50
$('#dragBtn').css('left', '45px')

let I_norm_Tgt = new Array;

let basCYCChart = echarts.init(document.getElementById('basChat'));
let tgtCYCChart = echarts.init(document.getElementById('tgtChat'));



// 处理时间轴数据用于画图？
// 因获取的csv文件 第一位数据的下标是1 处理成0
chatDataEnum.forEach((value, key) => {
    if (value[0][0] == 1) {
        chatDataEnum.set(key, value.map((i) =>{
            return [parseFloat(i[0]) - 1, i[1]]
        }))
    }
})


// ================================================ events =====================================================//

$('#BEV_DropDown').change(function (e) {
    Estimation_init(GECR[$('.BEV_DropDown')[0].value])
    clearEstimationResult()
})


// $("input[name='CLTC'][type='radio']").change((value) => {

//     BasCYC_DropDown = $('#bas_DropDown').val()
    
//     if ($("input[name='CLTC']:checked").val() == 'SELECT') {
//         $('#bas_DropDown').attr('disabled', false)
//         if (BasCYC_DropDown) {
//             BaseCYC_init(BasCYC_DropDown, chatDataEnum.get(BasCYC_DropDown))
//         }  
//     } else {
//         $('#bas_DropDown').attr('disabled', true)
//         BaseCYC_init($("input[name='CLTC']:checked").val(), chatDataEnum.get($("input[name='CLTC']:checked").val()))
//     }
//     clearEstimationResult()
    
// })


$("input[name='tgt'][type='radio']").change((value) => {
    if ($("input[name='tgt']:checked").val() == 'SELECT') {
        $('#tgtCYC_DropDown').attr('disabled', false)
        $($('.TgtCYC_Slider')[0]).css('color', 'rgba(0,0,0,0.2)')
        $($('.line')[0]).css('background', 'rgba(0,0,0,0.2)')
        $($('.dragBtn')[0]).css('background', 'rgba(0,0,0,0.2)')
        $($('.tick')).css('background', 'rgba(0,0,0,0.2)')
        $($('.num')).css('color', 'rgba(0,0,0,0.2)')
        TgtCYC_DropDown = $('#tgtCYC_DropDown').val()
        if (TgtCYC_DropDown) {
            TargetCYC_init(TgtCYC_DropDown, chatDataEnum.get(TgtCYC_DropDown))
        }
    } else {
        console.log()
        $($('.TgtCYC_Slider')[0]).css('color', 'rgba(0,0,0)')
        $($('.line')[0]).css('background', 'rgba(0,0,0)')
        $($('.dragBtn')[0]).css('background', 'rgba(0,0,0)')
        $($('.tick')).css('background', 'rgba(0,0,0,1)')
        $($('.num')).css('color', 'rgba(0,0,0,1)')
        $('#tgtCYC_DropDown').attr('disabled', true)
        TargetCYC_init(`const speed =${TgtCYC_Slider} km/h`, constSpeedData)
    }
    clearEstimationResult()
})

// speed
$('#dragBtn').mousedown(function (event) {
    if ($("input[name='tgt']:checked").val() == 'SELECT') return
    event.preventDefault();
    let that = this;
    let offsetX = parseInt(that.offsetLeft) // 获取当前的x轴距离
    let innerX = event.clientX - offsetX
    let offset = 5
    document.onmousemove = function (event) {
        if (event.clientX - innerX < -5) {
            return
        }
        
        if (event.clientX - innerX >= 200 - 4) {
            return
        }

        that.style.left = event.clientX - innerX + 'px'
        TgtCYC_Slider = event.clientX - innerX + 5
        constSpeedData = new Array(600).fill(0).map((item, index) => {
            return [index, TgtCYC_Slider]
        });
        TargetCYC_init(`const speed =${TgtCYC_Slider} km/h`, constSpeedData, true)
    }
    document.onmouseup = function () {

        document.onmousemove = null
        document.onmouseup = null
    }

})
$('#dragBtn').on('touchstart', function (event){
    if ($("input[name='tgt']:checked").val() == 'SELECT') return
    event.preventDefault();
    let that = event.originalEvent.touches[0];
    let innerX = 30
    let offset = 5
    $(document).on('touchmove', function (e) {
        
        let event =  e.targetTouches[0]
        let speed = (event.clientX - innerX).toFixed(0) 
        if (speed < -5) {
            return
        }
        
        if (speed >= 200 - 4) {
            return
        }


        $('#dragBtn').css('left', speed + 'px')
        TgtCYC_Slider = parseFloat(speed) + 5
        constSpeedData = new Array(600).fill(0).map((item, index) => {
            return [index, TgtCYC_Slider]
        });
        TargetCYC_init(`const speed =${TgtCYC_Slider} km/h`, constSpeedData, true)
    })
    $(document).on('touchend', function () {
        $(document).off('touchmove')
    })
})

$($('.line')[0]).click((e) => {
    let offsetX = e.offsetX - 5
    $('#dragBtn').css('left', offsetX + 'px')
    TgtCYC_Slider = e.offsetX
    constSpeedData = new Array(600).fill(0).map((item, index) => {
        return [index, TgtCYC_Slider]
    });
    TargetCYC_init(`const speed =${TgtCYC_Slider} km/h`, constSpeedData, true)
})



// $('#bas_DropDown').change((e) => {
//     BaseCYC_init(e.target.value, chatDataEnum.get(e.target.value))
//      clearEstimationResult()
// })

$('#tgtCYC_DropDown').change((e) => {
    TargetCYC_init(e.target.value, chatDataEnum.get(e.target.value))
    clearEstimationResult()
})

$('#Est_Button').click(() => {
    
    // let I_base = BasCYC_Plot.reduce((prev, cur, index) => {
    //     return parseFloat(prev) + parseFloat(cur[1])
    // }, 0) / BasCYC_Plot.length;

    // let I_Tgt = TgtCYC_Plot.reduce((prev, cur, index) => {
    //     return parseFloat(prev) + parseFloat(cur[1])
    // }, 0) / TgtCYC_Plot.length

    v_Base = BasCYC_Plot.map(v=> {return v[1]})
    v_Tgt = TgtCYC_Plot.map(v=> {return v[1]})

    I_base = drivingFeatureCal(v_Base,BEV_DropDown_para)
    I_Tgt = drivingFeatureCal(v_Tgt,BEV_DropDown_para)

    
    for (var i=0; i<4; i++){
        I_norm_Tgt[i] = (I_Tgt[i] / I_base[i]).toFixed(2);
    }

    setEstimationResult(I_norm_Tgt)

    let ECR_CLTC = BEV_DropDown_GECR.reduce((prev, cur) => {
        return prev + parseFloat(cur)
    }, 0)
    let ECR_Tgt = ECRs_Tgt.reduce((prev, cur) => {
        return prev + parseFloat(cur)
    }, 0)
    // $('#ECR_Tgt').html(ECR_Tgt.toFixed(2) + 'Wh/km')
    $('#ECR_CLTC').html(ECR_CLTC.toFixed(2) )
    $('#ECR_Tgt').html(ECR_Tgt.toFixed(2) )

    
    ECRs_PlotUpdate(ECR_Tgt)
})

// -------------------------------------------------------- startup -------------------------------------------------------- //

let startupFcn = () => {
    // 渲染表格
    Estimation_init(GECR[$('.BEV_DropDown')[0].value])

    // render basCYC
    BaseCYC_init($("input[name='CLTC']:checked").val(), chatDataEnum.get($("input[name='CLTC']:checked").val()))

    // render tgtCYC
    constSpeedData = new Array(600).fill(0).map((item, index) => {
        return [index, TgtCYC_Slider]
    });
    TargetCYC_init(`const speed =${TgtCYC_Slider} km/h`, constSpeedData, true)

}

// -------------------------------------------------------- Base Cycle init -------------------------------------------------------- //
let BaseCYC_init = (title, data) => {
    setBasChatTitle(title)
    BasCYC_Plot = data
    var option = option = {
        title: {
        text: ''
        },
        // tooltip: {
        //     trigger: 'axis'
        // },
        grid: {
            top: 20,
            right: 0,
            left: 50
        },
        xAxis: {
            name: 'Time[s]',
            nameLocation:'center',
            type: 'category',
            nameTextStyle: {
                padding: [20, 0, 0, 0]
            },
            axisTick: {
                interval: data.length >= 1000? 499 : 99
            },
            axisLabel: {
                interval: data.length >= 1000? 499 : 99
            },
            boundaryGap: false,
            data: data.map((item) => {
                return item[0]
            })
        },
        yAxis: {
            name: 'Speed[km/h]',
            nameTextStyle: {
                padding: [0, 0, 20, 0]
            },
            type: 'value',
            nameLocation: 'center',
            splitNumber: 1,
            min: -0.1,
            axisLine: {
                show: true
            },
            splitLine: {
                show: true
            }
        },
        series: [{
                name: 'speed',
                type: 'line',
                smooth: true,
                symbol: 'none',
                data: data.map((item) => {
                    return item[1]
                })
            }
            ]
    };
    basCYCChart.setOption(option);
}

// -------------------------------------------------------- target Cycle init -------------------------------------------------------- //

let TargetCYC_init = (title, data, constSpeed) => {
    setTgtChatTitle(title)
    TgtCYC_Plot = data
    var option = option = {
        title: {
            text: ''
        },
        // tooltip: {
        //     trigger: 'axis'
        // },
        grid: {
            top: 20,
            right: 0,
            left: 50
        },
        xAxis: {
            name: 'Time[s]',
            nameLocation: 'center',
            type: 'category',
            nameTextStyle: {
                padding: [20, 0, 0, 0]
            },
            axisTick: {
                interval: data.length >= 1000? 499 : 99
            },
            axisLabel: {
                interval: data.length >= 1000? 499 : 99
            },
            boundaryGap: false,
            data: data.map((item) => {
                return item[0]
            })
        },
        yAxis: {
            name: 'Speed[km/h]',
            nameTextStyle: {
                padding: [0, 0, 20, 0]
            },
            type: 'value',
            nameLocation: 'center',
            splitNumber: constSpeed? 2: 1,
            axisLine: {
                show: true
            },
            min: -0.1,
            splitLine: {
                show: true
            }
        },
        series: [{
            name: 'speed',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: data.map((item) => {
                return item[1]
            })
        }]
    };
    tgtCYCChart.setOption(option);
}

// -------------------------------------------------------- estimation init -------------------------------------------------------- //
function Estimation_init (value) {
    let data = value.GECR_BEV
    BEV_DropDown_GECR = data    
    BEV_DropDown_para = value.para_BEV

    $($('th')[1]).html(data[0])
    $($('th')[6]).html(data[1])
    $($('th')[11]).html(data[2])
    $($('th')[16]).html(data[3])
    $($('th')[21]).html(data[4])
}



// -------------------------------------------------------- driving feature calculation -------------------------------------------------------- //

function drivingFeatureCal(v,para){
    
    v = v.map(function(value){
        return parseFloat(value)/3.6
    });
    let ts = 1.0;
    let spd_lv = 15.0;
    if (v.length==1){
        var I_spd = sum(v.map(function(value){
                return value**2
            }));
        var I_brk_hi = 0;
        var I_brk_lo = 0;
        var I_slw = 1/v;
    }    
    else{
        let ind = Array(v.length-1).fill(' ').map((e, i) =>  i)
    //    arr2 = parseFloat(arr.slice(1)) + parseFloat(arr.slice(0,-1));
        
        let v_bar = ind.map(function(i){
            return (v[i]+v[i+1])*0.5
        })
        
     
        I_spd = sum(v_bar.map(function(value){
            return value**3
        }))/sum(v_bar);


        A = parseFloat(para[0]);        // N
        B = parseFloat(para[1])*3.6;    // N/(m/s)
        C = parseFloat(para[2])*(3.6**2);  // N/(m/s)^2
        m = parseFloat(para[3]);        // kg
        
        E_brk_hi = 0;
        E_brk_lo = 0;
        
        ind.map(function(i){
            temp = 0.5*m*(v[i]**2-v[i+1]**2)-0.5*A*ts*(v[i]+v[i+1])-1/3*B*ts*(v[i]**2+v[i+1]**2+v[i]*v[i+1])-1/4*C*ts*(v[i]**3+v[i]**2*v[i+1]+v[i]*v[i+1]**2+v[i+1]**3);
            if (temp<0){
                temp=0;
            }
            
            if (v_bar[i]>spd_lv){
                E_brk_hi = E_brk_hi + temp;
            }
            else{
                E_brk_lo = E_brk_lo + temp;
            }
        })
  
        I_brk_hi = E_brk_hi/3600/sum(v_bar)*ts/1000;
        I_brk_lo = E_brk_lo/3600/sum(v_bar)*ts/1000;

        I_slw = v_bar.length/sum(v_bar);

    }
    // console.log([A,B,C,m]);
    // console.log(I_spd);
    // console.log(I_brk_hi);
    // console.log(I_brk_lo);
    // console.log(I_slw);
   return [I_slw,I_brk_lo,I_brk_hi, I_spd]

}

function sum(arr) {
    return arr.reduce(function(prev, curr, idx, arr){
        return prev + curr;
    });
}


// -------------------------------------------------------- 3D plot update -------------------------------------------------------- //
function ECRs_PlotUpdate(value) {
    let heightValue = value*1.2 + "px";
    $('.bar').css('height', heightValue);     
    let str = `
        <div class="part1" style='flex: ${ECRs_Tgt[0]}'></div>
        <div class="part2" style='flex: ${ECRs_Tgt[1]}'></div>
        <div class="part3" style='flex: ${ECRs_Tgt[2]}'></div>
        <div class="part4" style='flex: ${ECRs_Tgt[3]}'></div>
        <div class="part5" style='flex: ${ECRs_Tgt[4]}'></div>
    `
    $($('.bar')[0]).css('display', 'flex')
    $($('.bar')[0]).html(str)
}
// -------------------------------------------------------- table update -------------------------------------------------------- //

function setEstimationResult (value) {
    $($('th')[3]).html(value[0])
    $($('th')[8]).html(value[1])
    $($('th')[13]).html(value[2])
    $($('th')[18]).html(value[3])
    

    ECRs_Tgt = [(value[0] * BEV_DropDown_GECR[0]).toFixed(1), 
                (value[1] * BEV_DropDown_GECR[1]).toFixed(1),
                (value[2] * BEV_DropDown_GECR[2]).toFixed(1),
                (value[3] * BEV_DropDown_GECR[3]).toFixed(1),
                BEV_DropDown_GECR[4]]

    $($('th')[4]).html(ECRs_Tgt[0])
    $($('th')[9]).html(ECRs_Tgt[1])
    $($('th')[14]).html(ECRs_Tgt[2])
    $($('th')[19]).html(ECRs_Tgt[3])
    $($('th')[24]).html(ECRs_Tgt[4])
}
function clearEstimationResult () {
    $($('th')[3]).html('')
    $($('th')[8]).html('')
    $($('th')[13]).html('')
    $($('th')[18]).html('')

    $($('th')[4]).html('')
    $($('th')[9]).html('' )
    $($('th')[14]).html('')
    $($('th')[19]).html('')
    $($('th')[24]).html('')

    $($('.bar')[0]).css('display', 'none')
    
    // $('#ECR_Tgt').html('Wh/km')
}


function createTicks () {
    let num = 21
    let str = ''
    for (var i = 0; i < num; i++) {
        str += `<div>
            <span class='tick' style="height: ${i % 5 == 0 && i!== 0 ? '10px' : '6px'}">
                <i></i>
            </span>
            <span class='num' style="display: ${i % 5 == 0 && i!== 0? 'block': 'none'}" >${i * 10}</span>
        </div>`
    }
    $('#ticks').html(str)
}


// -------------------------------------------------------- 2D plot update -------------------------------------------------------- //

function setBasChatTitle(value) {
    $('#basChatTitle').html(value)
}
function setTgtChatTitle(value) {
    if (value.indexOf('const speed') > -1) {
        $('#tgtChatTitle').html(value)
    } else {
        $('#tgtChatTitle').html(value)
    }
    
}

function checkViewport() {
    const warningElement = document.getElementById('mobileWarning');
    if (window.innerWidth < 1200) { // 如果视口宽度小于 768 像素
        warningElement.style.display = 'block'; // 显示提示框
    } else {
        warningElement.style.display = 'none'; // 隐藏提示框
    }
}


// 初次加载时检测视口宽度
checkViewport();

// 当窗口大小改变时重新检测视口宽度
window.onresize = checkViewport;


createTicks()
startupFcn()