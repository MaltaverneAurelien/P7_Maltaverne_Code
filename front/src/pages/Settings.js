import { useState } from "react";
import { useSelector } from "react-redux";
import { toastErr, toastInfo, toastSuccess } from "../lib/toast";
import "./Settings.css";

function Settings() {
  const userValue = useSelector((state) => state.user.value);
  const [file, setFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function handleOldPassword(e) {
    setOldPassword(e.target.value);
  }
  function handleNewPassword(e) {
    setNewPassword(e.target.value);
  }

  async function handleModifyPassword(e) {
    e.preventDefault();
    if (oldPassword === newPassword) {
      toastErr("Les mots de passes sont identiques !");
      return;
    }
    const res = await fetch("http://localhost:8000/api/user/modifyPassword", {
      method: "POST",
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + userValue.token,
      },
    });
    if (!res.ok) {
      return
    }
    toastSuccess("Mot de passe changé !");
  }

  function handleFile(e) {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  }

  async function handleForm(e) {
    e.preventDefault();

    const form = new FormData();
    form.append("image", file);

    const res = await fetch("http://localhost:8000/api/user/profileImg", {
      method: "POST",
      body: form,
      headers: {
        authorization: "Bearer " + userValue.token,
      },
    });

    if (!res.ok) {
      toastErr("Il y a un problème sur l'upload de l'image");
      return;
    }

    toastInfo("L'image de profil a été publié");
  }

  return (
    <div className="settings--container">
      <h1 className="settings--titre">Mes paramètres :</h1>
      <img
        src={`http://localhost:8000/api/user/${userValue.id}/avatar`}
        alt="Avatar"
        className="avatar--settings"
      />
      <div className="row--settings">
        <div className="settings--col-15">
          <div>Nom :</div>
        </div>
        <div className="settings--col-75">
          <div>{userValue.username}</div>
        </div>
      </div>
      <div className="row--settings">
        <div className="settings--col-15">
          <div>Adresse Mail :</div>
        </div>
        <div className="settings--col-75">
          <div>{userValue.email}</div>
        </div>
      </div>
      <div className="row--settings">
        <div className="settings--col-15">
          <label htmlFor="title">Image :</label>
        </div>
        <form onSubmit={handleForm} className="form--settings--image">
          <label className="btn--download">
            <input
              type="file"
              className="input--file"
              accept="image/png, image/jpeg"
              onChange={handleFile}
            />
            Choisir un fichier
          </label>
          <button className="btn--upload">Upload Image</button>
        </form>
        {file && (
          <>
            <div className="row--avatar--settings">
              <img
                src={URL.createObjectURL(file)}
                alt="Avatar"
                className="avatar--profile"
              />
            </div>
          </>
        )}
      </div>
      <form onSubmit={handleModifyPassword}>
        <div className="row--settings">
          <div className="settings--col-15">
            Ancien Password :
          </div>
          <div className="signup--col-75">
            <input
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={handleOldPassword}
              placeholder="Votre ancien mot de passe"
            />
          </div>
        </div>
        <div className="row--settings">
          <div className="settings--col-15">
            Nouveau Password :
          </div>
          <div className="signup--col-75">
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleNewPassword}
              placeholder="Votre nouveau mot de passe"
            />
          </div>
        </div>
        <div className="row--settings">
          <div className="settings--col-15">
            Modifier Password :
          </div>
          <div className="row--submit--settings">
            <button className="btn--modify">Modifier</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Settings;
