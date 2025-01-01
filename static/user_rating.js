document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("ratingModal");
  const btn = document.getElementById("ratingButton");
  const closeBtn = document.getElementById("closeModal");
  const submitBtn = document.getElementById("submitRating");
  const stars = document.querySelectorAll(".star");
  const dataContainer = document.getElementById("data-container");
  const Id = dataContainer.getAttribute("data-myWorryList");
  let currentRating = 0;

  btn.onclick = function () {
    modal.style.display = "block";
  };

  closeBtn.onclick = function () {
    modal.style.display = "none";
    resetStars();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      resetStars();
    }
  };

  stars.forEach((star) => {
    star.addEventListener("click", setRating);
    star.addEventListener("mouseover", hoverRating);
    star.addEventListener("mouseout", resetStars);
  });

  function setRating(e) {
    currentRating = e.target.dataset.rating;
    resetStars();
    for (let i = 0; i < currentRating; i++) {
      stars[i].classList.add("active");
    }
  }

  function hoverRating(e) {
    resetStars();
    const hoverRating = e.target.dataset.rating;
    for (let i = 0; i < hoverRating; i++) {
      stars[i].classList.add("active");
    }
  }

  function resetStars() {
    stars.forEach((star) => star.classList.remove("active"));
    for (let i = 0; i < currentRating; i++) {
      stars[i].classList.add("active");
    }
  }

  submitBtn.onclick = async function () {
    try {
      if (currentRating > 0) {
        //console.log("내가준 점수 = ", currentRating);
        //console.log("고민봉 id = ", Id);
        const data = {
          Id: Id,
          tempScore: currentRating,
        };

        const res = await axios({
          method: "patch",
          url: "/updateTemp",
          data: data,
        });
        const { result, message } = res.data;
        alert(message);

        modal.style.display = "none";
        currentRating = 0;
        resetStars();
        document.location.reload();
      } else {
        alert("별점을 선택해주세요.");
      }
    } catch (error) {}
  };
});
