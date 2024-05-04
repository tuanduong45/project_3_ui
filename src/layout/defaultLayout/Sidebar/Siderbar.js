const Siderbar = ({ collapsed, setCollapsed, items }) => {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={300}
    >
      {collapsed ? (
        <></>
      ) : (
        <div className={cx("logo")}>
          <FontAwesomeIcon
            icon={faHospital}
            size="6x"
            style={{
              color: "#1059bf",
              marginTop: "20px",
            }}
          />
        </div>
      )}

      <CustomMenu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        className={cx("menu")}
      ></CustomMenu>
    </Sider>
  );
};
