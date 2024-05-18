import { Modal, TextInput } from "@mantine/core";
import PropTypes from "prop-types";

export const EditProductModal = (props) => {

  return (
    <Modal
      opened={props.opened}
      onClose={props.close}
      transitionProps={props.transitionProps}
    >
      <TextInput label="First input" placeholder="First input" />
      <TextInput
        data-autofocus
        label="Input with initial focus"
        placeholder="It has data-autofocus attribute"
        mt="md"
      />
    </Modal>
  );
};

EditProductModal.propTypes = {
  opened: PropTypes.bool,
  close: PropTypes.func,
  transitionProps: PropTypes.object,
  selectedProductToEdit: PropTypes.object,
};
