import { db, storage } from "./firebase-config.js";
import {
  collection, addDoc, getDocs, serverTimestamp,
  query, orderBy, onSnapshot, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const menuForm = document.getElementById("menuForm");
const postsContainer = document.getElementById("postsContainer");

menuForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const mealType = document.getElementById("mealType").value;
  const description = document.getElementById("description").value;
  const imageFile = document.getElementById("image").files[0];
  let imageUrl = "";

  if (imageFile) {
    const imageRef = ref(storage, `menu-images/${Date.now()}-${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    imageUrl = await getDownloadURL(imageRef);
  }

  await addDoc(collection(db, "menus"), {
    mealType,
    description,
    imageUrl,
    timestamp: serverTimestamp(),
    likes: 0,
    comments: []
  });

  menuForm.reset();
});

// Real-time posts rendering
onSnapshot(query(collection(db, "menus"), orderBy("timestamp", "desc")), (snapshot) => {
  postsContainer.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const postEl = document.createElement("div");
    postEl.className = "post";
    postEl.innerHTML = `
      <h3>${data.mealType}</h3>
      <p>${data.description}</p>
      ${data.imageUrl ? `<img src="${data.imageUrl}" alt="menu image"/>` : ""}
      <div class="reactions">
        <button onclick="likePost('${docSnap.id}', ${data.likes})">👍 Like (${data.likes})</button>
      </div>
      <div class="comment-box">
        <textarea id="comment-${docSnap.id}" placeholder="Add a comment..."></textarea>
        <button onclick="addComment('${docSnap.id}')">Comment</button>
      </div>
      <div class="comments">
        ${data.comments?.map(c => `<div class="comment">${c}</div>`).join("") || ""}
      </div>
    `;
    postsContainer.appendChild(postEl);
  });
});

window.likePost = async function(id, currentLikes) {
  const docRef = doc(db, "menus", id);
  await updateDoc(docRef, { likes: currentLikes + 1 });
};

window.addComment = async function(id) {
  const commentInput = document.getElementById(`comment-${id}`);
  const commentText = commentInput.value.trim();
  if (!commentText) return;

  const docRef = doc(db, "menus", id);
  const docSnap = await (await getDocs(query(collection(db, "menus")))).docs.find(d => d.id === id);
  const currentData = docSnap.data();
  const updatedComments = [...(currentData.comments || []), commentText];

  await updateDoc(docRef, { comments: updatedComments });
  commentInput.value = "";
};
