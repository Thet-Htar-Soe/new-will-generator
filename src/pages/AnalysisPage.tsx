const AnalysisPage = () => {
  return (
    <div className="w-full">
      <div className="flex space-x-6 p-4 border rounded-md max-w-lg w-full">
        <div className="bg-white text-black p-8 rounded-md border flex flex-col gap-4">
          <p className="font-semibold">Select Assets</p>
          <label className="block">
            {" "}
            <input
              type="checkbox"
              checked={[formData!.asset_one, formData!.asset_two, formData!.asset_three].every((a) =>
                assetOptions.includes(a)
              )}
              onChange={() => {
                const allAssets = [formData!.asset_one, formData!.asset_two, formData!.asset_three];
                if (allAssets.every((a) => assetOptions.includes(a))) {
                  setAssetOptions([]);
                } else {
                  setAssetOptions(allAssets);
                }
              }}
            />
            Select All
          </label>
          <label className="block">
            <input
              type="checkbox"
              checked={assetOptions.includes(formData!.asset_one)}
              onChange={() => toggleAsset(formData!.asset_one)}
            />
            Asset One: {formData!.asset_one}
          </label>
          <label className="block">
            <input
              type="checkbox"
              checked={assetOptions.includes(formData!.asset_two)}
              onChange={() => toggleAsset(formData!.asset_two)}
            />
            Asset Two: {formData!.asset_two}
          </label>
          <label className="block">
            <input
              type="checkbox"
              checked={assetOptions.includes(formData!.asset_three)}
              onChange={() => toggleAsset(formData!.asset_three)}
            />
            Asset Three: {formData!.asset_three}
          </label>
        </div>

        <div className="bg-white text-black p-8 rounded-md border flex flex-col gap-4">
          <p className="font-semibold">Select Family Members</p>
          <label className="block">
            <input
              type="checkbox"
              checked={formData!.family_mem.every((m) => familyOptions.includes(m.id))}
              onChange={() => {
                if (formData!.family_mem.every((m) => familyOptions.includes(m.id))) {
                  setFamilyOptions([]);
                } else {
                  setFamilyOptions(formData!.family_mem.map((m) => m.id));
                }
              }}
            />
            Select All
          </label>
          {formData!.family_mem.map((member) => (
            <label key={member.id} className="block">
              <input
                type="checkbox"
                checked={familyOptions.includes(member.id)}
                onChange={() => toggleFamily(member.id)}
              />
              {member.name} ({member.relationship})
            </label>
          ))}
        </div>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateDiagram}>
        Create
      </button>
    </div>
  );
};

export default AnalysisPage;
