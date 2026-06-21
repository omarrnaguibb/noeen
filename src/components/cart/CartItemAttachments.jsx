import { useState } from "react";
import { FaCommentDots, FaPaperclip, FaCamera } from "react-icons/fa6";
import { useTranslation } from "../../context/LanguageContext";

export default function CartItemAttachments({ itemId }) {
  const { t } = useTranslation();
  const [showNote, setShowNote] = useState(false);
  const [showFile, setShowFile] = useState(false);

  return (
    <section className="attachments m-2.5 rounded  bg-white sm:mx-0 sm:my-5  sm:p-2">
      <div>
        <label className="form-label">
          <b className="block">{t("cartPage.attachments")}</b>
        </label>

        <div className="mt-4 text-end w-full ">
          <div className="flex flex-col gap-2.5 sm:flex-row justify-center ">
            <button
              type="button"
              name="btn-product-add-note"
              data-show={`note_${itemId}`}
              onClick={() => setShowNote((value) => !value)}
              className="btn-tab btn btn--collapse flex-1"
            >
              <FaCommentDots className="font-medium ltr:mr-1.5 rtl:ml-1" />
              <span className="fix-align">{t("cartPage.addNote")}</span>
            </button>
            <button
              type="button"
              name="btn-product-add-file"
              data-show={`file_${itemId}`}
              onClick={() => setShowFile((value) => !value)}
              className="btn-tab btn btn--collapse flex-1"
            >
              <FaPaperclip className="font-medium ltr:mr-1.5 rtl:ml-1" />
              <span className="fix-align">{t("cartPage.attachFile")}</span>
            </button>
          </div>

          <div
            id={`note_${itemId}`}
            className={showNote ? "pt-0 opacity-100" : "h-0 overflow-hidden opacity-0"}
          >
            <div className="pt-2.5 sm:pt-5">
              <textarea
                className="animated animatedfadeInDown fadeInDown form-input block h-16 bg-gray-50"
                placeholder={t("cartPage.notePlaceholder")}
                name="notes"
                cols={30}
                rows={10}
              />
            </div>
          </div>

          <div
            id={`file_${itemId}`}
            className={showFile ? "pt-0 opacity-100" : "h-0 overflow-hidden opacity-0"}
          >
            <div className="min-h-[120px] pt-2.5 sm:pt-4">
              <label className="product-option-uploader s-file-upload block cursor-pointer">
                <div className="product-option-uploader-placholder">
                  <span className="product-option-uploader-placholder-icon">
                    <FaCamera />
                  </span>
                  <p className="profile-filepond-placholder-text">{t("cartPage.fileDropPlaceholder")}</p>
                  <span className="filepond--label-action" tabIndex={0}>
                    {t("cartPage.browse")}
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  name="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
