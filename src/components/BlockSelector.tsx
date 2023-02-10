import React, { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import Countdown from "react-countdown";

interface ComponentProps {
  sort: string;
  setSort(sort: string): void;
  blocks: string[];
  blocksInformation: Map<string, any>;
  blockNumber: number;
  generation: number;
  mintMax: number;
  generationTotal: number;
  informationText: string;
  errorText: string;
  setBlockNumber(blockNumber: number): void;
  totalMinted: number;
  launchDate: Date;
  onAllowlist: boolean;
  blockUI: boolean;
  animate: boolean;
  setAnimate(animate: boolean): void;
}

const BlockSelector: React.FC<ComponentProps> = (props: ComponentProps) => {
  const sort = props.sort;
  const setSort = props.setSort;
  const blocks = props.blocks;
  const blockNumber = props.blockNumber;
  const setBlockNumber = props.setBlockNumber;
  const blocksInformation = props.blocksInformation;
  const informationText = props.informationText;
  const errorText = props.errorText;
  const totalMinted = props.totalMinted;
  const currentDate = new Date(Date.now());
  const launchDate = props.launchDate;
  const onAllowlist = props.onAllowlist;
  const generation = props.generation;
  const mintMax = props.mintMax;
  const generationTotal = props.generationTotal;
  const blockUI = props.blockUI;
  const animate = props.animate;
  const setAnimate = props.setAnimate;

  const preparationForNextGen = false;

  const [orderedBlocks, setOrderedBlocks] = useState<Array<string>>([]);

  type renderObj = {
    hours: string;
    author: string;
    price: number;
  };

  const allowListPreGen = (
    <span>
      {onAllowlist
        ? `Congrats! You are on the whitelist! Ready to mint?`
        : "Ooh, looks like you're not on the whitelist. Come back for public mint!"}
    </span>
  );

  const allowListPostGen =
    launchDate > currentDate ? (
      <span>
        Allowlist open for <Countdown date={launchDate} />
        <br></br>
        <span className="text-sm">
          {onAllowlist
            ? `Cool! Looks like you're on the allowlist. You can mint ${mintMax} in total`
            : "Ooh, looks like you're not on the allowlist. Come back for public mint!"}
        </span>
        <span className="block mb-.2" />
      </span>
    ) : null;

  function deleteArtificialAdditions() {
    var elements = document.getElementsByClassName("artificialAddition");
    while (elements.length > 0) {
      if (elements[0].parentNode !== null) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    }
  }

  const blockTaken = (b: string) => {
    return (
      blocksInformation.get(b).status == "reserved" ||
      blocksInformation.get(b).status == "acquired"
    );
  };

  function createArtificialAdditions() {
    var buttonContainer = document.getElementById("showScroll");

    if (buttonContainer) {
      if (buttonContainer.children.length > 0) {
        var yPositionOfFirstRow =
          buttonContainer.children[0].getBoundingClientRect().y;
        var foundDiff = false;
        var count = 0;

        while (foundDiff === false) {
          for (var i = 0; i < buttonContainer.children.length; i++) {
            if (
              buttonContainer.children[i].getBoundingClientRect().y !==
              yPositionOfFirstRow
            ) {
              foundDiff = true;
              break;
            }
            count++;
          }
        }

        if (blocks.length % count !== 0) {
          var amountToAdd = count - (blocks.length % count);
          for (var i = 0; i < amountToAdd; i++) {
            var clone = buttonContainer.children[0].cloneNode(
              true
            ) as HTMLElement;
            clone.classList.add("artificialAddition");
            buttonContainer.appendChild(clone);
          }
        }
      }
    }
  }

  window.addEventListener("resize", (e) => {
    //deleteArtificialAdditions();
    //createArtificialAdditions();
  });

  useEffect(() => {
    //createArtificialAdditions();
    //document.getElementById("showScroll")?.focus()
  }, [orderedBlocks.length != 0]);

  useEffect(() => {
    if (sort == "Oldest") {
      setOrderedBlocks([...blocks]);
      setBlockNumber(Number(blocks[0]));
    } else {
      const reversed = orderedBlocks.reverse();
      setOrderedBlocks([...reversed]);
      setBlockNumber(Number(reversed[0]));
    }
  }, [sort, blocks]);

  const blockHandler = (e: any) => {
    setAnimate(false);
    if (blockUI) return;

    const selectedBlockNumber: number = Number(e.currentTarget.value);
    setBlockNumber(selectedBlockNumber);
  };

  const orderedBlocksDisplay = orderedBlocks.map((b, i) => (
    <div className="m-auto">
      <button
        key={i}
        id={b}
        onClick={blockHandler}
        value={b}
        className={`{ ${
          blockNumber.toString() === b
            ? `${
                blockTaken(b)
                  ? " bg-white bg-opacity-50"
                  : "bg-white border-white"
              }`
            : ` ${blockTaken(b) ? "bg-transparent" : "bg-button"} `
        } 
      ${
        blockNumber.toString() === b
          ? blockTaken(b)
            ? "text-white"
            : "text-buttonActiveText"
          : "text-buttonText"
      }
      w-fit mt-2 mb-2 py-1 mr-2 ml-0 px-3 shadow-md no-underline rounded-full text-md sm:text-xs midSm:text-md border-2 border-button  ${
        blockTaken(b) ? " bg-transparent" : ""
      }`}
      >
        #{b}
        {/*`{ ${(selectedSeed === b ? 'bg-white' : 'bg-button')} w-[33%] mt-2 mb-2 py-1 lg:px-4 md:px-3 sm:px-2 shadow-md no-underline rounded-full text-sm ml-1 mr-1 ${selectedSeed === b ? 'text-buttonActiveText' : 'text-buttonText'}` */}
      </button>
    </div>
  ));

  return (
    <div className="lg:w-[50%] md:w-[90%] sm:w-[90%]  pt-4 lg:pl-[3%] md:pl-[0%] sm:pl-[0%] lg:m-0 md:m-auto sm:m-auto bg-special lg:block md:block sm:block">
      <div className="lg:w-[100%] md:w-full sm:w-full"></div>

      {/*figure out */}
      <div className="lg:float-left md:float-none sm:float-none lg:w-[60%] md:w-[80%] sm:w-full max-w-[600px] lg:min-w-[400px] m-auto">
        <div className="w-full float-left">
          <ConnectKitButton.Custom>
            {({
              isConnected,
              isConnecting,
              show,
              hide,
              truncatedAddress,
              address,
              ensName,
            }) => {
              return (
                <div>
                  {!isConnected ? (
                    <div className="w-[100%]">
                      <svg
                        onClick={show}
                        viewBox="0 0 178 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="178" height="32" rx="16" fill="#ADFFD8" />
                        <path
                          d="M19.96 20.976C20.4187 20.976 20.808 20.9013 21.128 20.752C21.4587 20.592 21.7253 20.384 21.928 20.128C22.1413 19.8613 22.296 19.5627 22.392 19.232C22.4987 18.8907 22.552 18.5333 22.552 18.16V17.968H23.896V18.16C23.896 18.7253 23.8107 19.2587 23.64 19.76C23.4693 20.2507 23.2187 20.6827 22.888 21.056C22.5573 21.4187 22.1467 21.7067 21.656 21.92C21.1653 22.1227 20.6 22.224 19.96 22.224C18.7227 22.224 17.7573 21.8347 17.064 21.056C16.3707 20.2773 16.024 19.1413 16.024 17.648V15.152C16.024 13.7013 16.3707 12.576 17.064 11.776C17.7573 10.976 18.7227 10.576 19.96 10.576C20.6 10.576 21.1653 10.6827 21.656 10.896C22.1467 11.0987 22.5573 11.3867 22.888 11.76C23.2187 12.1227 23.4693 12.5547 23.64 13.056C23.8107 13.5467 23.896 14.0747 23.896 14.64V14.832H22.552V14.64C22.5413 14.2773 22.4827 13.9253 22.376 13.584C22.28 13.2427 22.1253 12.944 21.912 12.688C21.7093 12.4213 21.448 12.2133 21.128 12.064C20.808 11.904 20.4187 11.824 19.96 11.824C19.096 11.824 18.4453 12.1387 18.008 12.768C17.5813 13.3973 17.368 14.224 17.368 15.248V17.552C17.368 18.6507 17.5813 19.4987 18.008 20.096C18.4453 20.6827 19.096 20.976 19.96 20.976ZM33.6769 18.128C33.6769 18.7893 33.5649 19.376 33.3409 19.888C33.1275 20.3893 32.8395 20.816 32.4769 21.168C32.1142 21.5093 31.6875 21.7707 31.1969 21.952C30.7169 22.1333 30.2155 22.224 29.6929 22.224C29.1595 22.224 28.6529 22.1333 28.1729 21.952C27.6929 21.7707 27.2715 21.5093 26.9089 21.168C26.5462 20.816 26.2529 20.3893 26.0289 19.888C25.8155 19.376 25.7089 18.7893 25.7089 18.128V17.936C25.7089 17.2853 25.8155 16.7093 26.0289 16.208C26.2529 15.696 26.5462 15.264 26.9089 14.912C27.2822 14.56 27.7089 14.2933 28.1889 14.112C28.6689 13.9307 29.1702 13.84 29.6929 13.84C30.2155 13.84 30.7169 13.9307 31.1969 14.112C31.6769 14.2933 32.0982 14.56 32.4609 14.912C32.8342 15.264 33.1275 15.696 33.3409 16.208C33.5649 16.7093 33.6769 17.2853 33.6769 17.936V18.128ZM29.6929 21.04C30.0769 21.04 30.4289 20.976 30.7489 20.848C31.0795 20.7093 31.3675 20.512 31.6129 20.256C31.8582 20 32.0502 19.696 32.1889 19.344C32.3275 18.9813 32.3969 18.576 32.3969 18.128V17.936C32.3969 17.5093 32.3275 17.12 32.1889 16.768C32.0502 16.4053 31.8582 16.096 31.6129 15.84C31.3675 15.584 31.0795 15.3867 30.7489 15.248C30.4182 15.0987 30.0662 15.024 29.6929 15.024C29.3195 15.024 28.9675 15.0987 28.6369 15.248C28.3062 15.3867 28.0182 15.584 27.7729 15.84C27.5275 16.096 27.3355 16.4053 27.1969 16.768C27.0582 17.12 26.9889 17.5093 26.9889 17.936V18.128C26.9889 18.576 27.0582 18.9813 27.1969 19.344C27.3355 19.696 27.5275 20 27.7729 20.256C28.0182 20.512 28.3009 20.7093 28.6209 20.848C28.9515 20.976 29.3089 21.04 29.6929 21.04ZM37.2338 22H35.9858V14.064H37.2338V15.408H37.4258C37.9164 14.3627 38.7698 13.84 39.9858 13.84C40.9031 13.84 41.6338 14.128 42.1778 14.704C42.7218 15.2693 42.9938 16.1227 42.9938 17.264V22H41.7458V17.52C41.7458 16.688 41.5591 16.064 41.1858 15.648C40.8124 15.232 40.3058 15.024 39.6658 15.024C38.9084 15.024 38.3111 15.2853 37.8738 15.808C37.4471 16.32 37.2338 17.008 37.2338 17.872V22ZM47.0306 22H45.7826V14.064H47.0306V15.408H47.2226C47.7133 14.3627 48.5666 13.84 49.7826 13.84C50.7 13.84 51.4306 14.128 51.9746 14.704C52.5186 15.2693 52.7906 16.1227 52.7906 17.264V22H51.5426V17.52C51.5426 16.688 51.356 16.064 50.9826 15.648C50.6093 15.232 50.1026 15.024 49.4626 15.024C48.7053 15.024 48.108 15.2853 47.6706 15.808C47.244 16.32 47.0306 17.008 47.0306 17.872V22ZM56.4915 18.416C56.5235 19.2053 56.7688 19.84 57.2275 20.32C57.6862 20.8 58.3262 21.04 59.1475 21.04C59.5208 21.04 59.8462 20.9973 60.1235 20.912C60.4008 20.8267 60.6355 20.7093 60.8275 20.56C61.0302 20.4107 61.1902 20.24 61.3075 20.048C61.4355 19.8453 61.5368 19.632 61.6115 19.408L62.7955 19.728C62.5715 20.464 62.1555 21.0667 61.5475 21.536C60.9502 21.9947 60.1395 22.224 59.1155 22.224C58.5502 22.224 58.0275 22.128 57.5475 21.936C57.0782 21.7333 56.6728 21.4507 56.3315 21.088C55.9902 20.7253 55.7235 20.2933 55.5315 19.792C55.3395 19.2907 55.2435 18.736 55.2435 18.128V17.744C55.2435 17.1893 55.3395 16.672 55.5315 16.192C55.7342 15.712 56.0115 15.3013 56.3635 14.96C56.7155 14.608 57.1262 14.336 57.5955 14.144C58.0755 13.9413 58.5928 13.84 59.1475 13.84C59.7982 13.84 60.3582 13.9627 60.8275 14.208C61.3075 14.4427 61.6968 14.736 61.9955 15.088C62.3048 15.44 62.5288 15.824 62.6675 16.24C62.8168 16.656 62.8915 17.04 62.8915 17.392V18.416H56.4915ZM59.1475 15.024C58.7955 15.024 58.4648 15.0827 58.1555 15.2C57.8568 15.3067 57.5902 15.4613 57.3555 15.664C57.1315 15.8667 56.9448 16.1067 56.7955 16.384C56.6568 16.6507 56.5662 16.944 56.5235 17.264H61.6435C61.6222 16.9227 61.5368 16.6133 61.3875 16.336C61.2488 16.0587 61.0622 15.824 60.8275 15.632C60.6035 15.44 60.3422 15.2907 60.0435 15.184C59.7555 15.0773 59.4568 15.024 59.1475 15.024ZM72.8004 19.184C72.715 19.6213 72.5657 20.0267 72.3524 20.4C72.1497 20.7733 71.8884 21.0987 71.5684 21.376C71.2484 21.6427 70.875 21.8507 70.4484 22C70.0217 22.1493 69.547 22.224 69.0244 22.224C68.4697 22.224 67.9417 22.1333 67.4404 21.952C66.9497 21.7707 66.5177 21.5093 66.1444 21.168C65.771 20.816 65.4724 20.3893 65.2484 19.888C65.035 19.3867 64.9284 18.8107 64.9284 18.16V17.968C64.9284 17.328 65.035 16.752 65.2484 16.24C65.4724 15.728 65.771 15.296 66.1444 14.944C66.5177 14.592 66.9497 14.32 67.4404 14.128C67.9417 13.936 68.4697 13.84 69.0244 13.84C69.5257 13.84 69.9897 13.9147 70.4164 14.064C70.843 14.2133 71.2164 14.4267 71.5364 14.704C71.867 14.9707 72.1337 15.2907 72.3364 15.664C72.5497 16.0373 72.6937 16.4427 72.7684 16.88L71.5204 17.168C71.4884 16.8907 71.4084 16.624 71.2804 16.368C71.163 16.1013 70.9977 15.872 70.7844 15.68C70.5817 15.4773 70.331 15.3173 70.0324 15.2C69.7337 15.0827 69.387 15.024 68.9924 15.024C68.6084 15.024 68.2457 15.0987 67.9044 15.248C67.5737 15.3867 67.2804 15.5893 67.0244 15.856C66.7684 16.112 66.5657 16.4213 66.4164 16.784C66.2777 17.1467 66.2084 17.5413 66.2084 17.968V18.16C66.2084 18.608 66.2777 19.0133 66.4164 19.376C66.5657 19.728 66.7684 20.0267 67.0244 20.272C67.2804 20.5173 67.579 20.7093 67.9204 20.848C68.2617 20.976 68.6297 21.04 69.0244 21.04C69.419 21.04 69.7604 20.9813 70.0484 20.864C70.347 20.736 70.5977 20.576 70.8004 20.384C71.0137 20.1813 71.179 19.952 71.2964 19.696C71.4244 19.44 71.5097 19.1733 71.5524 18.896L72.8004 19.184ZM74.9013 14.064H77.3973V10.8H78.6453V14.064H81.7173V15.216H78.6453V20.368C78.6453 20.688 78.7893 20.848 79.0773 20.848H81.3333V22H78.6293C78.2666 22 77.9679 21.8827 77.7333 21.648C77.5093 21.4133 77.3973 21.1147 77.3973 20.752V15.216H74.9013V14.064ZM101.855 22H99.407L98.367 11.376H98.175L97.135 22H94.687L93.551 10.8H94.767L95.839 21.424H96.031L97.039 10.8H99.503L100.511 21.424H100.703L101.775 10.8H102.991L101.855 22ZM110.324 20.656H110.132C109.876 21.1893 109.519 21.584 109.06 21.84C108.612 22.096 108.137 22.224 107.636 22.224C107.113 22.224 106.628 22.1387 106.18 21.968C105.732 21.7867 105.337 21.5253 104.996 21.184C104.665 20.832 104.404 20.4053 104.212 19.904C104.02 19.4027 103.924 18.8213 103.924 18.16V17.904C103.924 17.2533 104.02 16.6773 104.212 16.176C104.404 15.6747 104.665 15.2533 104.996 14.912C105.337 14.56 105.732 14.2933 106.18 14.112C106.628 13.9307 107.103 13.84 107.604 13.84C108.148 13.84 108.639 13.9627 109.076 14.208C109.524 14.4427 109.876 14.8107 110.132 15.312H110.324V14.064H111.572V20.368C111.572 20.688 111.716 20.848 112.004 20.848H112.404V22H111.556C111.193 22 110.895 21.8827 110.66 21.648C110.436 21.4133 110.324 21.1147 110.324 20.752V20.656ZM107.764 21.04C108.137 21.04 108.479 20.9707 108.788 20.832C109.108 20.6933 109.38 20.496 109.604 20.24C109.828 19.984 110.004 19.68 110.132 19.328C110.26 18.9653 110.324 18.5653 110.324 18.128V17.936C110.324 17.5093 110.26 17.12 110.132 16.768C110.004 16.4053 109.823 16.096 109.588 15.84C109.364 15.584 109.092 15.3867 108.772 15.248C108.463 15.0987 108.127 15.024 107.764 15.024C107.391 15.024 107.049 15.0933 106.74 15.232C106.431 15.3707 106.159 15.568 105.924 15.824C105.7 16.0693 105.524 16.3733 105.396 16.736C105.268 17.088 105.204 17.4773 105.204 17.904V18.16C105.204 19.0667 105.439 19.776 105.908 20.288C106.388 20.7893 107.007 21.04 107.764 21.04ZM114.361 20.848H117.241V11.952H114.457V10.8H118.489V20.848H121.369V22H114.361V20.848ZM124.158 20.848H127.038V11.952H124.254V10.8H128.286V20.848H131.166V22H124.158V20.848ZM134.867 18.416C134.899 19.2053 135.144 19.84 135.603 20.32C136.061 20.8 136.701 21.04 137.523 21.04C137.896 21.04 138.221 20.9973 138.499 20.912C138.776 20.8267 139.011 20.7093 139.203 20.56C139.405 20.4107 139.565 20.24 139.683 20.048C139.811 19.8453 139.912 19.632 139.987 19.408L141.171 19.728C140.947 20.464 140.531 21.0667 139.923 21.536C139.325 21.9947 138.515 22.224 137.491 22.224C136.925 22.224 136.403 22.128 135.923 21.936C135.453 21.7333 135.048 21.4507 134.707 21.088C134.365 20.7253 134.099 20.2933 133.907 19.792C133.715 19.2907 133.618 18.736 133.618 18.128V17.744C133.618 17.1893 133.715 16.672 133.907 16.192C134.109 15.712 134.387 15.3013 134.739 14.96C135.091 14.608 135.501 14.336 135.971 14.144C136.451 13.9413 136.968 13.84 137.523 13.84C138.173 13.84 138.733 13.9627 139.203 14.208C139.683 14.4427 140.072 14.736 140.371 15.088C140.68 15.44 140.904 15.824 141.043 16.24C141.192 16.656 141.267 17.04 141.267 17.392V18.416H134.867ZM137.523 15.024C137.171 15.024 136.84 15.0827 136.531 15.2C136.232 15.3067 135.965 15.4613 135.731 15.664C135.507 15.8667 135.32 16.1067 135.171 16.384C135.032 16.6507 134.941 16.944 134.899 17.264H140.019C139.997 16.9227 139.912 16.6133 139.763 16.336C139.624 16.0587 139.437 15.824 139.203 15.632C138.979 15.44 138.717 15.2907 138.419 15.184C138.131 15.0773 137.832 15.024 137.523 15.024ZM143.479 14.064H145.975V10.8H147.223V14.064H150.295V15.216H147.223V20.368C147.223 20.688 147.367 20.848 147.655 20.848H149.911V22H147.207C146.845 22 146.546 21.8827 146.311 21.648C146.087 21.4133 145.975 21.1147 145.975 20.752V15.216H143.479V14.064Z"
                          fill="#121212"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="lg:w-[60%] sm:w-[100%] lg:min-w-[500px] lg:max-w-[600px]">
                      <h1 className="lg:text-lg md:text-md sm:text-md bg-transparent lg:inline-block md:hidden sm:hidden">
                        <svg
                          className="w-3.5 inline-block align-baseline"
                          viewBox="0 0 13 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            y="-6.10352e-05"
                            width="13"
                            height="13"
                            rx="6.5"
                            fill="#ADFFD8"
                          />
                        </svg>
                        &nbsp;
                        <span className="opacity-60">{truncatedAddress}</span>
                        &nbsp;|&nbsp;
                        <span
                          onClick={show}
                          role="button"
                          className="opacity-30"
                        >
                          Disconnect
                        </span>
                        &nbsp;&nbsp;
                        <br></br>
                        <div className="mt-3"></div>
                      </h1>
                      <h1 className="lg:text-lg md:text-md sm:text-md bg-transparent">
                        {preparationForNextGen
                          ? allowListPreGen
                          : allowListPostGen}
                        <br></br>
                        <span>
                          <span className="text-teal">{totalMinted}</span>/
                          {generationTotal + " "}
                          Minted&nbsp;
                        </span>

                        <svg
                          className="inline-block w-7 align-top"
                          role="button"
                          viewBox="0 0 90 90"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => {
                            window.open(
                              "https://opensea.io/collection/blockalizer-chroma",
                              "_blank"
                            );
                          }}
                        >
                          <g clipPath="url(#clip0_547_104)">
                            <rect
                              x="15"
                              y="17"
                              width="61"
                              height="55"
                              fill="#717171"
                            />
                            <path
                              d="M45 0C20.151 0 0 20.151 0 45C0 69.849 20.151 90 45 90C69.849 90 90 69.849 90 45C90 20.151 69.858 0 45 0ZM22.203 46.512L22.392 46.206L34.101 27.891C34.272 27.63 34.677 27.657 34.803 27.945C36.756 32.328 38.448 37.782 37.656 41.175C37.323 42.57 36.396 44.46 35.352 46.206C35.217 46.458 35.073 46.71 34.911 46.953C34.839 47.061 34.713 47.124 34.578 47.124H22.545C22.221 47.124 22.032 46.773 22.203 46.512ZM74.376 52.812C74.376 52.983 74.277 53.127 74.133 53.19C73.224 53.577 70.119 55.008 68.832 56.799C65.538 61.38 63.027 67.932 57.402 67.932H33.948C25.632 67.932 18.9 61.173 18.9 52.83V52.56C18.9 52.344 19.08 52.164 19.305 52.164H32.373C32.634 52.164 32.823 52.398 32.805 52.659C32.706 53.505 32.868 54.378 33.273 55.17C34.047 56.745 35.658 57.726 37.395 57.726H43.866V52.677H37.467C37.143 52.677 36.945 52.299 37.134 52.029C37.206 51.921 37.278 51.813 37.368 51.687C37.971 50.823 38.835 49.491 39.699 47.97C40.284 46.944 40.851 45.846 41.31 44.748C41.4 44.55 41.472 44.343 41.553 44.145C41.679 43.794 41.805 43.461 41.895 43.137C41.985 42.858 42.066 42.57 42.138 42.3C42.354 41.364 42.444 40.374 42.444 39.348C42.444 38.943 42.426 38.52 42.39 38.124C42.372 37.683 42.318 37.242 42.264 36.801C42.228 36.414 42.156 36.027 42.084 35.631C41.985 35.046 41.859 34.461 41.715 33.876L41.661 33.651C41.553 33.246 41.454 32.868 41.328 32.463C40.959 31.203 40.545 29.97 40.095 28.818C39.933 28.359 39.753 27.918 39.564 27.486C39.294 26.82 39.015 26.217 38.763 25.65C38.628 25.389 38.52 25.155 38.412 24.912C38.286 24.642 38.16 24.372 38.025 24.111C37.935 23.913 37.827 23.724 37.755 23.544L36.963 22.086C36.855 21.888 37.035 21.645 37.251 21.708L42.201 23.049H42.219C42.228 23.049 42.228 23.049 42.237 23.049L42.885 23.238L43.605 23.436L43.866 23.508V20.574C43.866 19.152 45 18 46.413 18C47.115 18 47.754 18.288 48.204 18.756C48.663 19.224 48.951 19.863 48.951 20.574V24.939L49.482 25.083C49.518 25.101 49.563 25.119 49.599 25.146C49.725 25.236 49.914 25.38 50.148 25.56C50.337 25.704 50.535 25.884 50.769 26.073C51.246 26.46 51.822 26.955 52.443 27.522C52.605 27.666 52.767 27.81 52.92 27.963C53.721 28.71 54.621 29.583 55.485 30.555C55.728 30.834 55.962 31.104 56.205 31.401C56.439 31.698 56.7 31.986 56.916 32.274C57.213 32.661 57.519 33.066 57.798 33.489C57.924 33.687 58.077 33.894 58.194 34.092C58.554 34.623 58.86 35.172 59.157 35.721C59.283 35.973 59.409 36.252 59.517 36.522C59.85 37.26 60.111 38.007 60.273 38.763C60.327 38.925 60.363 39.096 60.381 39.258V39.294C60.435 39.51 60.453 39.744 60.471 39.987C60.543 40.752 60.507 41.526 60.345 42.3C60.273 42.624 60.183 42.93 60.075 43.263C59.958 43.578 59.85 43.902 59.706 44.217C59.427 44.856 59.103 45.504 58.716 46.098C58.59 46.323 58.437 46.557 58.293 46.782C58.131 47.016 57.96 47.241 57.816 47.457C57.609 47.736 57.393 48.024 57.168 48.285C56.97 48.555 56.772 48.825 56.547 49.068C56.241 49.437 55.944 49.779 55.629 50.112C55.449 50.328 55.251 50.553 55.044 50.751C54.846 50.976 54.639 51.174 54.459 51.354C54.144 51.669 53.892 51.903 53.676 52.11L53.163 52.569C53.091 52.641 52.992 52.677 52.893 52.677H48.951V57.726H53.91C55.017 57.726 56.07 57.339 56.925 56.61C57.213 56.358 58.482 55.26 59.985 53.604C60.039 53.541 60.102 53.505 60.174 53.487L73.863 49.527C74.124 49.455 74.376 49.644 74.376 49.914V52.812Z"
                              fill="#3E3E3E"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_547_104">
                              <rect width="90" height="90" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </h1>

                      <div className="mt-5"></div>
                    </div>
                  )}
                </div>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
        <h1 className="lg:w-[100%] sm:w-[98%]">
          Sort By:
          <select
            id="dropdown"
            name="dropdown"
            placeholder="Oldest"
            className={`bg-transparent opacity-50 ${
              sort === "Oldest" ? "flex-wrap" : "flex-wrap-reverse"
            }`}
            onChange={(e) => {
              setSort(e.target.value);
              //no need to create or delete artificial additions, all buttons are the same size and therefore their reverse order mirrors the current order STRUCTURE
            }}
          >
            <option value="Oldest">Oldest</option>
            <option value="Newest">Newest</option>
          </select>
          <span className="float-right">{blocks.length} Total TX</span>
        </h1>
        <div
          id="showScroll"
          className={`max-h-[300px] border-teal pt-1 pl-2 pr-2 pb-1 border-opacity-80 rounded-xl border-2 scrollbar-thin scrollbar-w-2 srcollbar-rounded-[12px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-buttonText scrollbar-track-button flex flex-row content-start flex-wrap w-[100%] mt-2 lg:h-auto md:h-auto sm:h-auto overflow-scroll pr-1 pl-1 justify-start`}
        >
          {orderedBlocksDisplay}
        </div>
        <br></br>
        <span className="italic text-sm text-buttonText">
          Genesis {generation} of 12
        </span>
        <span className="block mb-3"></span>
        <div>
          {informationText}
          <br></br>
          <span className="block mb-3"></span>

          {informationText === "Minting completed. Enjoy your block!" && (
            <div id="tweet-button">
              <a
                id="tweet"
                target="_blank"
                role="button"
                className="underline"
                onClick={(e) => {
                  e.preventDefault();

                  window.open(
                    `https://twitter.com/intent/tweet?text=I+just+turned+blockchain+TX+%23${blockNumber}+into+a+generative+collectible+NFT+with+%40blockalizerxyz%2C+check+it+out%21%0Ablockalizer.xyz`,
                    "_blank"
                  );
                }}
              >
                Share to Twitter
              </a>
            </div>
          )}
        </div>
        <div className="mb-5 text-red-400">{errorText}</div>
      </div>
    </div>
  );
};

export default BlockSelector;
