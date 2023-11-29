<template>
    <div class="footDiv">
        <a href="https://github.com/Edevige/The-Cinematic-Eye" 
        target="_blank">
            <div class="fwidget widget-button" 
            style="left: 155px; top: 372px; width: 248px; height: 72px; z-index: 417; 
            transform: rotate(-33deg) translate(0px); border-radius: 40px;">
                <div class="common-button" style="flex-direction: row;">
                    <div class="text" style="display: inline-block; width: auto; padding-left: 0px; text-indent: 0px; height: 72px; line-height: 72px;">GITHUB</div>
                </div>
            </div>
        </a>
        <a href="https://github.com/Edevige/The-Cinematic-Eye" 
        target="_blank">
            <div class="fwidget widget-button " 
            style="left: 375px; top: 262px; width: 158px; height: 158px; z-index: 417; 
            transform: rotate(-12deg) translate(0px); border-radius: 79px;">
                <div class="common-button" style="flex-direction: row;">
                    <div class="text" style="display: inline-block; width: auto; padding-left: 0px; text-indent: 0px; height: 72px; line-height: 72px;"><i class="bi bi-instagram"></i></div>
                </div>
            </div>
        </a>
        <a href="https://github.com/Edevige/The-Cinematic-Eye" 
        target="_blank">
            <div class="burst-12">
                
            </div>
        </a>
        
    </div>
</template>

<script>
export default {
    setup () {
        

        return {}
    }
}
</script>

<style lang="scss" scoped>

    .footDiv{
        height: min-content;
    }
    .fwidget{
        position: relative;
    }
    .widget-button{
        background-color: rgb(255,254,244);
        border-radius: 40px;
        border-width: 1px;
        border-color: rgb(32,32,32);
        //font-family: custom_64265;
        font-weight: 500;
        font-style: normal;
        color: rgb(32,32,32);
        font-size: 40px;
        letter-spacing: 0px;
    }
    .common-button {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: -ms-flexbox;
        -ms-flex-flow: row nowrap;
        display: -webkit-flex;
        -webkit-align-items: center;
        -webkit-align-content: center;
        -webkit-justify-content: center;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        -webkit-flex-flow: row nowrap;
        flex-flow: row nowrap;
        flex-direction: row;
        -ms-writing-mode: lr-tb;
        -webkit-writing-mode: horizontal-tb;
        writing-mode: horizontal-tb;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        //border-style: solid;
        overflow: hidden;
    }
    .common-button .text {
        padding: 0;
        padding-left: 0px;
        margin: 0;
        overflow-y: hidden;
        overflow-x: hidden;
        outline: none;
        border: none;
        resize: none;
        background-color: transparent;
        -webkit-flex: 0 0 auto;
        flex: 0 0 auto;
        line-height: 1.4;
        text-align: center;
        white-space: nowrap;
        //font-family: inherit;
        //text-transform: inherit;
        //font-weight: inherit;
        //font-style: inherit;
        //text-decoration: inherit;
        color: inherit;
        //font-size: inherit;
        //letter-spacing: inherit;
        overflow: visible;
    }
    .text .bi{
        font-size: 65px;
    }
    .burst-12 {
      background: rgb(255, 255, 255);
      width: 80px;
      height: 80px;
      position: relative;
      text-align: center;
    }
    .burst-12:before,
    .burst-12:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 80px;
      width: 80px;
      background: rgb(255, 255, 255);
    }
    .burst-12:before {
      transform: rotate(30deg);
    }
    .burst-12:after {
      transform: rotate(60deg);
    }
  
</style>