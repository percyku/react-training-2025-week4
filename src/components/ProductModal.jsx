const ProductModal = ({
  modalRef,
  modalType,
  templateData,
  handleModalInputChange,
  handleImageChange,
  handleAddImage,
  handleRemoveImage,
  delProductData,
  addOrUpdateProductData,
  closeModal,
}) => {
  return (
    <div
      className="modal fade"
      ref={modalRef}
      tabIndex="-1"
      id="exampleModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title " id="exampleModalLabel">
              {modalType === "delete"
                ? "刪除產品"
                : modalType === "edit"
                  ? "更新產品"
                  : "新增產品"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => closeModal()}
            ></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <p className="h4">
                確定要刪除
                <span className="text-danger">{templateData.title}</span>
                嗎?
              </p>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <label htmlFor="imageUrl" className="form-label">
                    輸入圖片網址
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="imageUrl"
                    placeholder="請輸入圖片連結"
                    value={templateData.imageUrl}
                    onChange={handleModalInputChange}
                  />

                  <img
                    className="img-fluid"
                    src={templateData.imageUrl}
                    alt="主圖"
                  />

                  <div>
                    {templateData.imagesUrl.map((image, index) => (
                      <div key={index} className="mb-2">
                        <input
                          type="text"
                          value={image}
                          onChange={(e) =>
                            handleImageChange(index, e.target.value)
                          }
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖_ ${index + 1}`}
                            className="img-preview mb-2"
                          />
                        )}
                      </div>
                    ))}

                    <div className="d-flex justify-content-between">
                      {templateData.imagesUrl.length < 5 &&
                        templateData.imagesUrl[
                          templateData.imagesUrl.length - 1
                        ] !== "" && (
                          <button
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={handleAddImage}
                          >
                            新增圖片
                          </button>
                        )}

                      {templateData.imagesUrl.length >= 1 && (
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={handleRemoveImage}
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label htmlFor="title" className="form-label">
                          標題
                        </label>
                        <input
                          id="title"
                          type="text"
                          className="form-control"
                          placeholder="請輸入標題"
                          value={templateData.title}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="category" className="form-label">
                          分類
                        </label>
                        <input
                          id="category"
                          type="text"
                          className="form-control"
                          placeholder="請輸入分類"
                          value={templateData.category}
                          onChange={handleModalInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-2">
                        <label htmlFor="unit" className="form-label">
                          單位
                        </label>
                        <input
                          id="unit"
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                          value={templateData.unit}
                          onChange={handleModalInputChange}
                        />
                      </div>

                      <div className="mb-2">
                        <label htmlFor="origin_price" className="form-label">
                          原價
                        </label>
                        <input
                          id="origin_price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入原價"
                          value={templateData.origin_price}
                          onChange={handleModalInputChange}
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="price" className="form-label">
                          售價
                        </label>
                        <input
                          id="price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入售價"
                          value={templateData.price}
                          onChange={handleModalInputChange}
                        />
                      </div>
                    </div>

                    <hr />
                    <div className="mb-2">
                      <label htmlFor="description" className="form-label">
                        產品描述
                      </label>
                      <textarea
                        id="description"
                        className="form-control"
                        placeholder="請輸入產品描述"
                        value={templateData.description}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>

                    <div className="mb-2">
                      <label htmlFor="content" className="form-label">
                        說明內容
                      </label>
                      <textarea
                        id="content"
                        className="form-control"
                        placeholder="請輸入說明內容"
                        value={templateData.content}
                        onChange={handleModalInputChange}
                      ></textarea>
                    </div>
                    <div className="mb-2">
                      <div className="form-check">
                        <input
                          id="is_enabled"
                          className="form-check-input"
                          type="checkbox"
                          checked={templateData.is_enabled}
                          onChange={handleModalInputChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_enabled"
                        >
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => closeModal()}
            >
              取消
            </button>
            {modalType === "delete" ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => delProductData(templateData.id)}
                >
                  刪除
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addOrUpdateProductData(templateData.id)}
                >
                  送出
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
