import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Divider,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  useDisclosure,
  Container,
  Stack,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../store/authSlice";
import { fetchItems, addItem, editItem, deleteItem } from "../store/itemsSlice";
import { fetchOtherCosts, addOtherCost, editOtherCost, deleteOtherCost } from "../store/otherCostsSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen: isItemOpen, onOpen: onItemOpen, onClose: onItemClose } = useDisclosure();
  const { isOpen: isCostOpen, onOpen: onCostOpen, onClose: onCostClose } = useDisclosure();

  const user = useSelector((state) => state.auth.user);
  const items = useSelector((state) => state.items.list);
  const itemsStatus = useSelector((state) => state.items.status);
  const otherCosts = useSelector((state) => state.otherCosts.list);
  const otherCostsStatus = useSelector((state) => state.otherCosts.status);

  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [costDescription, setCostDescription] = useState("");
  const [costAmount, setCostAmount] = useState(0);
  const [editingCost, setEditingCost] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      dispatch(setUser(auth.currentUser));
      dispatch(fetchItems(auth.currentUser.uid));
      dispatch(fetchOtherCosts(auth.currentUser.uid));
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  const totalCost =
    items.reduce((sum, item) => sum + Number(item.cost || 0), 0) +
    otherCosts.reduce((sum, cost) => sum + Number(cost.amount || 0), 0);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    navigate("/login");
  };

  const handleAddOrEditItem = async () => {
    if (!itemName || itemCost <= 0) {
      toast({
        title: "Invalid Input",
        description: "Item name and cost must be valid.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (editingItem) {
        await dispatch(
          editItem({
            userId: user.uid,
            itemId: editingItem.id,
            updatedItem: { name: itemName, cost: Number(itemCost) },
          })
        );
        toast({
          title: "Item Updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await dispatch(
          addItem({
            userId: user.uid,
            item: { name: itemName, cost: Number(itemCost) },
          })
        );
        toast({
          title: "Item Added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setItemName("");
      setItemCost(0);
      setEditingItem(null);
      onItemClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await dispatch(deleteItem({ userId: user.uid, itemId }));
      toast({
        title: "Item Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddOrEditCost = async () => {
    if (!costDescription || costAmount <= 0) {
      toast({
        title: "Invalid Input",
        description: "Description and amount must be valid.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (editingCost) {
        await dispatch(
          editOtherCost({
            userId: user.uid,
            costId: editingCost.id,
            updatedCost: { description: costDescription, amount: Number(costAmount) },
          })
        );
        toast({
          title: "Cost Updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await dispatch(
          addOtherCost({
            userId: user.uid,
            cost: { description: costDescription, amount: Number(costAmount) },
          })
        );
        toast({
          title: "Cost Added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setCostDescription("");
      setCostAmount(0);
      setEditingCost(null);
      onCostClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCost = async (costId) => {
    try {
      await dispatch(deleteOtherCost({ userId: user.uid, costId }));
      toast({
        title: "Cost Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (itemsStatus === "loading" || otherCostsStatus === "loading") {
    return (
      <Box p={10} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Stack spacing={6}>
        <Heading textAlign="center">Project Cost Tracker</Heading>
        <Text textAlign="center" color="gray.500">
          Logged in as <strong>{user?.email}</strong>
        </Text>

        <Box bg="teal.50" p={4} rounded="md" boxShadow="base">
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            Total Project Cost: ₹<span style={{ color: "#2C7A7B" }}>{totalCost.toFixed(2)}</span>
          </Text>
        </Box>

        {/* Project Items */}
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Project Items</Heading>
            <Button size="sm" colorScheme="teal" onClick={() => { setEditingItem(null); onItemOpen(); }}>
              + Add Item
            </Button>
          </Flex>
          <VStack spacing={3} align="stretch">
            {items.length === 0 ? (
              <Text color="gray.500">No items added yet.</Text>
            ) : (
              items.map((item) => (
                <Box key={item.id} p={4} bg="white" rounded="md" boxShadow="sm">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text>Cost: ₹{item.cost.toFixed(2)}</Text>
                    </Box>
                    <Box>
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        size="sm"
                        mr={2}
                        onClick={() => {
                          setEditingItem(item);
                          setItemName(item.name);
                          setItemCost(item.cost);
                          onItemOpen();
                        }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      />
                    </Box>
                  </Flex>
                </Box>
              ))
            )}
          </VStack>
        </Box>

        {/* Other Costs */}
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Other Costs</Heading>
            <Button size="sm" colorScheme="teal" onClick={() => { setEditingCost(null); onCostOpen(); }}>
              + Add Cost
            </Button>
          </Flex>
          <VStack spacing={3} align="stretch">
            {otherCosts.length === 0 ? (
              <Text color="gray.500">No other costs added yet.</Text>
            ) : (
              otherCosts.map((cost) => (
                <Box key={cost.id} p={4} bg="white" rounded="md" boxShadow="sm">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">{cost.description}</Text>
                      <Text>Amount: ₹{cost.amount.toFixed(2)}</Text>
                    </Box>
                    <Box>
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="blue"
                        size="sm"
                        mr={2}
                        onClick={() => {
                          setEditingCost(cost);
                          setCostDescription(cost.description);
                          setCostAmount(cost.amount);
                          onCostOpen();
                        }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteCost(cost.id)}
                      />
                    </Box>
                  </Flex>
                </Box>
              ))
            )}
          </VStack>
        </Box>

        <Divider />

        <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
      </Stack>

      {/* Add/Edit Item Modal */}
      <Modal isOpen={isItemOpen} onClose={onItemClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingItem ? "Edit Item" : "Add New Item"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Item Name</FormLabel>
              <Input
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                focusBorderColor="teal.500"
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Cost</FormLabel>
              <NumberInput min={1} value={itemCost} onChange={(value) => setItemCost(value)}>
                <NumberInputField placeholder="Enter item cost in ₹" />
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleAddOrEditItem} mr={3}>
              {editingItem ? "Update" : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => { setEditingItem(null); onItemClose(); }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add/Edit Other Cost Modal */}
      <Modal isOpen={isCostOpen} onClose={onCostClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingCost ? "Edit Cost" : "Add New Cost"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Enter cost description"
                value={costDescription}
                onChange={(e) => setCostDescription(e.target.value)}
                focusBorderColor="teal.500"
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Amount</FormLabel>
              <NumberInput min={1} value={costAmount} onChange={(value) => setCostAmount(value)}>
                <NumberInputField placeholder="Enter cost amount in ₹" />
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleAddOrEditCost} mr={3}>
              {editingCost ? "Update" : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => { setEditingCost(null); onCostClose(); }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Dashboard;