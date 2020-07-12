import axios from "axios";
import swal from "sweetalert";

const BASE_URL = "http://localhost:3000/contacts";

window.onload = function () {
  let tBody = document.querySelector("#tBody");

  // Get Data From Server and Fill The Table When Page Loaded
  axios
    .get(BASE_URL)
    .then((res) => {
      res.data.forEach((contact) => {
        createTdElement(contact, tBody);
      });
    })
    .catch((err) => console.log(err));

  // Add EventLitsener to Save Contact
  let saveContactBtn = document.querySelector("#saveContact");
  saveContactBtn.addEventListener("click", function () {
    if (nameField.value.trim() != "") {
      if (emailField.value !== "") {
        const email = document.getElementById('emailField');
        checkEmail(email);
      } else if (emailField.value === "" && phoneField.value.trim() !== "") {
        const phone = document.getElementById('phoneField');
        checkPhone(phone);
      } else {
        createNewContact();
      }
    } else {
      swal({
        title: "Alert!",
        text: "Please put some name to save contact",
        icon: "warning",
      });
    }
  });
};

// Create New Contact Function
function createNewContact() {
  let nameField = document.querySelector("#nameField");
  let phoneField = document.querySelector("#phoneField");
  let emailField = document.querySelector("#emailField");

  let contact = {
    name: nameField.value,
    phone: phoneField.value,
    email: emailField.value,

  };

  axios
    .post(BASE_URL, contact)
    .then((res) => {
      let tBody = document.querySelector("#tBody");
      createTdElement(res.data, tBody);

      nameField.value = "";
      phoneField.value = "";
      emailField.value = "";
    })
    .catch((err) => console.log(err));

  swal({
    title: "Saved Successfully!",
    icon: "success",
  });
}

// Creating a tr element and appending to it's parent element
function createTdElement(contact, parentElement) {
  const tr = document.createElement("tr");

  const tdName = document.createElement("td");
  tdName.innerHTML = contact.name;
  tr.appendChild(tdName);

  const tdPhone = document.createElement("td");
  tdPhone.innerHTML = contact.phone ? contact.phone : "N/A";
  tr.appendChild(tdPhone);

  const tdEmail = document.createElement("td");
  tdEmail.innerHTML = contact.email ? contact.email : "N/A";
  tr.appendChild(tdEmail);

  const tdActions = document.createElement("td");

  const tdEditBtn = document.createElement("button");
  tdEditBtn.className = "btn btn-warning mx-1";
  tdEditBtn.innerHTML = "Edit";
  tdEditBtn.addEventListener("click", function () {
    let mainModal = $("#contactEditModal");
    mainModal.modal("toggle");

    let editName = document.querySelector("#edit-name");
    let editPhone = document.querySelector("#edit-phone");
    let editEmail = document.querySelector("#edit-email");

    editName.value = contact.name ? contact.name : "";
    editPhone.value = contact.phone ? contact.phone : "";
    editEmail.value = contact.email ? contact.email : "";

    let updateBtn = document.querySelector("#updateContact");
    updateBtn.addEventListener("click", function () {
      let editContact = {
        name: editName.value,
        phone: editPhone.value,
        email: editEmail.value,
      };

      axios
        .put(`${BASE_URL}/${contact.id}`, editContact)
        .then((res) => {
          tdName.innerHTML = res.data.name;
          tdPhone.innerHTML = res.data.phone;
          tdEmail.innerHTML = res.data.email;

          mainModal.modal("hide");

          swal({
            title: "Updated Successfully!",
            icon: "success",
          });
        })
        .catch((err) => console.log(err));
    });
  });
  tdActions.appendChild(tdEditBtn);

  const tdDeleteBtn = document.createElement("button");
  tdDeleteBtn.className = "btn btn-danger";
  tdDeleteBtn.innerHTML = "Delete";
  tdDeleteBtn.addEventListener("click", function () {
    let deleteModal = $("#contactDeleteModal");
    deleteModal.modal("toggle");

    let deleteBtn = document.querySelector("#deleteContact");
    deleteBtn.addEventListener("click", function () {
      axios
        .delete(`${BASE_URL}/${contact.id}`)
        .then((res) => {
          parentElement.removeChild(tr);

          deleteModal.modal("hide");

          swal({
            title: "Deleted Successfully!",
            icon: "success",
          });
        })
        .catch((err) => console.log(err));
    });
  });
  tdActions.appendChild(tdDeleteBtn);

  tr.appendChild(tdActions);

  parentElement.appendChild(tr);
}

// Check email is valid
function checkEmail(input) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {

    if (phoneField.value.trim() === "") {
      createNewContact();
    } else {
      const phone = document.getElementById('phoneField');
      checkPhone(phone);
    }

  } else {
    swal({
      title: "Alert!",
      text: "Email is not valid",
      icon: "warning",
    });
  }
}

// Check phone no. is valid
function checkPhone(input) {
  const re = /^\d{11}$/;
  if (re.test(input.value.trim())) {
    createNewContact();
  } else {
    swal({
      title: "Alert!",
      text: "Phone no. must be 11 digits",
      icon: "warning",
    });
  }
}